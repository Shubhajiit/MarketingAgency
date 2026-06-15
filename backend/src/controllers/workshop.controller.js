const Workshop = require('../models/Workshop');
const WorkshopRegistration = require('../models/WorkshopRegistration');
const User = require('../models/User');
const { sendWorkshopConfirmationEmail } = require('../utils/emailService');
const { getCache, setCache, delCache, delCachePattern } = require('../utils/redis');
const { getPresignedUrl } = require('../utils/s3');

// ─── Public: List all active workshops ───────────────────────
exports.listWorkshops = async (req, res) => {
  try {
    const { page = 1, limit = 20, tag, type } = req.query;
    const cacheKey = `workshops:list:page:${page}:limit:${limit}:tag:${tag || 'all'}:type:${type || 'all'}`;

    // Try to get from Redis cache
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      console.log(`[Redis] Cache HIT for key: ${cacheKey}`);
      // Sign brochureUrl in cached list on the fly
      const processedWorkshops = await Promise.all((cachedData.workshops || []).map(async (w) => {
        const wObj = { ...w };
        if (wObj.brochureUrl && !wObj.brochureUrl.startsWith('http')) {
          try {
            wObj.brochureUrl = await getPresignedUrl(wObj.brochureUrl, 3600);
          } catch (e) {
            console.error('Failed to sign brochureUrl in cached list:', e);
          }
        }
        return wObj;
      }));
      return res.status(200).json({
        success: true,
        data: {
          ...cachedData,
          workshops: processedWorkshops
        }
      });
    }

    console.log(`[Redis] Cache MISS for key: ${cacheKey}`);

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = { isActive: true };
    if (tag) filter.tags = { $in: [tag] };
    if (type) filter.type = type;

    const [workshops, total] = await Promise.all([
      Workshop.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v'),
      Workshop.countDocuments(filter),
    ]);

    const responseData = {
      workshops,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    };

    // Cache the list (TTL: 1 hour)
    await setCache(cacheKey, responseData, 3600);

    const processedWorkshops = await Promise.all(workshops.map(async (w) => {
      const wObj = w.toObject();
      if (wObj.brochureUrl && !wObj.brochureUrl.startsWith('http')) {
        try {
          wObj.brochureUrl = await getPresignedUrl(wObj.brochureUrl, 3600);
        } catch (e) {
          console.error('Failed to sign brochureUrl in fetched list:', e);
        }
      }
      return wObj;
    }));

    res.status(200).json({
      success: true,
      data: {
        ...responseData,
        workshops: processedWorkshops
      },
    });
  } catch (error) {
    console.error('List Workshops Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── Public: Get single workshop by slug ─────────────────────
exports.getWorkshopBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const cacheKey = `workshop:slug:${slug}`;

    // Try to get from Redis cache
    const cachedWorkshop = await getCache(cacheKey);
    if (cachedWorkshop) {
      console.log(`[Redis] Cache HIT for key: ${cacheKey}`);
      const workshopObj = { ...cachedWorkshop };
      if (workshopObj.brochureUrl && !workshopObj.brochureUrl.startsWith('http')) {
        try {
          workshopObj.brochureUrl = await getPresignedUrl(workshopObj.brochureUrl, 3600);
        } catch (e) {
          console.error('[Redis Cache] Failed to generate presigned URL:', e);
        }
      }
      return res.status(200).json({ success: true, data: { workshop: workshopObj } });
    }

    console.log(`[Redis] Cache MISS for key: ${cacheKey}`);
    // Cache miss - query MongoDB
    const workshop = await Workshop.findOne({
      slug,
      isActive: true,
    }).select('-__v');

    if (!workshop) {
      return res.status(404).json({ success: false, message: 'Workshop not found' });
    }

    // Cache the retrieved workshop (TTL: 1 hour)
    await setCache(cacheKey, workshop, 3600);

    const workshopObj = workshop.toObject();
    if (workshopObj.brochureUrl && !workshopObj.brochureUrl.startsWith('http')) {
      try {
        workshopObj.brochureUrl = await getPresignedUrl(workshopObj.brochureUrl, 3600);
      } catch (e) {
        console.error('[DB Fetch] Failed to generate presigned URL:', e);
      }
    }

    res.status(200).json({ success: true, data: { workshop: workshopObj } });
  } catch (error) {
    console.error('Get Workshop By Slug Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── Admin: Get single workshop by ID ────────────────────────
exports.getWorkshopById = async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id).select('-__v');
    if (!workshop) {
      return res.status(404).json({ success: false, message: 'Workshop not found' });
    }
    res.status(200).json({ success: true, data: { workshop } });
  } catch (error) {
    console.error('Get Workshop By ID Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── Admin: Create workshop ───────────────────────────────────
exports.createWorkshop = async (req, res) => {
  try {
    const {
      title, subtitle, description, instructor,
      instructorImage, instructorDescription,
      price, originalPrice, priceCaption, bonusDeadlineText, currency, thumbnail,
      tags, isActive,
      highlights, modules, targetAudience, learningOutcomes, whatYouWillLearn, courseOutcomes,
      experts, heroPoints, workshopDates, slug,
      rating1Value, rating1Count, rating1Platform,
      rating2Value, rating2Count, rating2Platform,
      type, deadline, brochureUrl,
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const workshopData = {
      title: title.trim(),
      subtitle: subtitle || '',
      description: description || '',
      instructor: instructor || '',
      instructorImage: instructorImage || '',
      instructorDescription: instructorDescription || '',
      price: Number(price) || 0,
      originalPrice: Number(originalPrice) || 0,
      priceCaption: priceCaption || '',
      bonusDeadlineText: bonusDeadlineText || '',
      currency: currency || 'INR',
      thumbnail: thumbnail || '',
      tags: Array.isArray(tags) ? tags.filter(Boolean) : [],
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      highlights: highlights || [],
      modules: modules || [],
      targetAudience: targetAudience || [],
      learningOutcomes: learningOutcomes || [],
      whatYouWillLearn: whatYouWillLearn || [],
      courseOutcomes: courseOutcomes || [],
      experts: experts || [],
      heroPoints: heroPoints || [],
      workshopDates: workshopDates || [],
      rating1Value: rating1Value || '4.5/5',
      rating1Count: rating1Count || '(725)',
      rating1Platform: rating1Platform || 'Trustpilot',
      rating2Value: rating2Value || '4.07/5',
      rating2Count: rating2Count || '(88)',
      rating2Platform: rating2Platform || 'Rating Facts',
      type: type || 'one-day',
      deadline: deadline || null,
      brochureUrl: brochureUrl || '',
    };

    // Allow manual slug override
    if (slug && slug.trim()) {
      workshopData.slug = slug.trim().toLowerCase().replace(/\s+/g, '-');
    }

    const workshop = new Workshop(workshopData);
    await workshop.save();

    // Invalidate Redis list cache
    await delCachePattern('workshops:list:*');

    res.status(201).json({ success: true, data: { workshop } });
  } catch (error) {
    console.error('Create Workshop Error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'A workshop with this slug already exists. Please use a different title.' });
    }
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

// ─── Admin: Update workshop ───────────────────────────────────
exports.updateWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ success: false, message: 'Workshop not found' });
    }

    const oldSlug = workshop.slug;

    const allowedFields = [
      'title', 'subtitle', 'description', 'instructor',
      'instructorImage', 'instructorDescription',
      'price', 'originalPrice', 'priceCaption', 'bonusDeadlineText', 'currency', 'thumbnail',
      'tags', 'isActive',
      'highlights', 'modules', 'targetAudience', 'learningOutcomes', 'whatYouWillLearn', 'courseOutcomes',
      'experts', 'heroPoints', 'workshopDates', 'slug',
      'rating1Value', 'rating1Count', 'rating1Platform',
      'rating2Value', 'rating2Count', 'rating2Platform',
      'type', 'deadline', 'brochureUrl',
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        workshop[field] = req.body[field];
      }
    }

    // If slug is being updated manually, normalize it
    if (req.body.slug) {
      workshop.slug = req.body.slug.trim().toLowerCase().replace(/\s+/g, '-');
    }

    await workshop.save();

    // Invalidate Redis cache
    if (oldSlug) {
      await delCache(`workshop:slug:${oldSlug}`);
    }
    if (workshop.slug && workshop.slug !== oldSlug) {
      await delCache(`workshop:slug:${workshop.slug}`);
    }
    await delCachePattern('workshops:list:*');

    res.status(200).json({ success: true, data: { workshop } });
  } catch (error) {
    console.error('Update Workshop Error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'A workshop with this slug already exists.' });
    }
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

// ─── Admin: Soft-delete workshop (set isActive = false) ──────
exports.deleteWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findByIdAndUpdate(
      req.params.id,
      { isActive: false, isCancelled: false },
      { new: true }
    );

    if (!workshop) {
      return res.status(404).json({ success: false, message: 'Workshop not found' });
    }

    // Invalidate Redis cache
    if (workshop.slug) {
      await delCache(`workshop:slug:${workshop.slug}`);
    }
    await delCachePattern('workshops:list:*');

    res.status(200).json({ success: true, message: 'Workshop deactivated successfully' });
  } catch (error) {
    console.error('Delete Workshop Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── Admin: Cancel workshop ──────────────────────────────────
exports.cancelWorkshop = async (req, res) => {
  try {
    // Verify admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden. Admin access required.' });
    }

    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ success: false, message: 'Workshop not found' });
    }

    // Mark workshop as inactive (removes it from the main website) and cancelled
    workshop.isActive = false;
    workshop.isCancelled = true;
    await workshop.save();

    // Invalidate Redis cache
    if (workshop.slug) {
      await delCache(`workshop:slug:${workshop.slug}`);
    }
    await delCachePattern('workshops:list:*');

    // Mark registrations as cancelled in bulk
    // Find count of registrations to report back
    const paidRegistrationsCount = await WorkshopRegistration.countDocuments({
      workshopId: workshop._id,
      paymentStatus: 'paid',
      cancellationEmailSent: { $ne: true }
    });

    // Start the background cancellation queue (non-blocking)
    const { startCancellationQueue } = require('../utils/cancellationQueue');
    startCancellationQueue(workshop._id);

    res.status(200).json({
      success: true,
      message: `Workshop cancelled successfully. Initalized email queue for ${paidRegistrationsCount} paid participants.`,
      data: {
        totalPaidUsers: paidRegistrationsCount
      }
    });
  } catch (error) {
    console.error('Cancel Workshop Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

// ─── Admin: List ALL workshops (including inactive/cancelled) ─
exports.adminListWorkshops = async (req, res) => {
  try {
    const { page = 1, limit = 100, type } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // List active workshops, or inactive ones that were cancelled (so they show up as Cancelled)
    const filter = { $or: [{ isActive: { $ne: false } }, { isCancelled: true }] };
    if (type) filter.type = type;

    const [workshops, total] = await Promise.all([
      Workshop.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v'),
      Workshop.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        workshops,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Admin List Workshops Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── User: Register for a workshop (auth required) ────────────
exports.registerForWorkshop = async (req, res) => {
  try {
    const { id } = req.params; // workshop _id
    const { name, email, phone, whatsappNumber, selectedDate, age, profession } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !selectedDate) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, and selectedDate are required',
      });
    }

    // Find workshop
    const workshop = await Workshop.findById(id);
    if (!workshop || !workshop.isActive) {
      return res.status(404).json({ success: false, message: 'Workshop not found' });
    }

    // Find the user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update user phone/whatsapp if they provided them
    if (phone && !user.phoneNumber) user.phoneNumber = phone;
    if (whatsappNumber && !user.whatsappNumber) user.whatsappNumber = whatsappNumber;

    // Enroll user in workshop (avoid duplicates)
    const alreadyEnrolled = user.enrolledWorkshops.some(
      (wId) => wId.toString() === id
    );
    if (!alreadyEnrolled) {
      user.enrolledWorkshops.push(id);
    }
    await user.save();

    // Create registration record
    const registration = await WorkshopRegistration.create({
      userId: user._id,
      workshopId: id,
      workshopTitle: workshop.title,
      workshopSlug: workshop.slug || '',
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      whatsappNumber: (whatsappNumber || '').trim(),
      age: (age || '').trim(),
      profession: (profession || '').trim(),
      selectedDate: new Date(selectedDate),
      amountPaid: workshop.price || 0,
      currency: workshop.currency || 'INR',
      paymentStatus: 'paid',
    });

    // Send confirmation email with PDF invoice asynchronously (non-blocking)
    sendWorkshopConfirmationEmail(registration, workshop).catch((err) => {
      console.error('[WorkshopController] Error sending confirmation email:', err);
    });

    res.status(201).json({
      success: true,
      data: { registration },
      message: 'Successfully registered for workshop',
    });
  } catch (error) {
    console.error('Register For Workshop Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};
