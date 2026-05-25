const Workshop = require('../models/Workshop');

// ─── Public: List all active workshops ───────────────────────
exports.listWorkshops = async (req, res) => {
  try {
    const { page = 1, limit = 20, tag } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = { isActive: true };
    if (tag) filter.tags = { $in: [tag] };

    const [workshops, total] = await Promise.all([
      Workshop.find(filter)
        .sort({ startDate: 1, createdAt: -1 })
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
    console.error('List Workshops Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── Public: Get single workshop by slug ─────────────────────
exports.getWorkshopBySlug = async (req, res) => {
  try {
    const workshop = await Workshop.findOne({
      slug: req.params.slug,
      isActive: true,
    }).select('-__v');

    if (!workshop) {
      return res.status(404).json({ success: false, message: 'Workshop not found' });
    }

    res.status(200).json({ success: true, data: { workshop } });
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
      price, currency, thumbnail, heroImage, brochureUrl, hasBrochure,
      batchNumber, startDate, workshopTime, duration, durationDetail,
      fee, feeNote, eligibility, eligibilityDetail,
      applicationDeadline, tags, isActive,
      highlights, modules, targetAudience, learningOutcomes,
      experts, slots, slug,
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const workshopData = {
      title: title.trim(),
      subtitle: subtitle || '',
      description: description || '',
      instructor: instructor || '',
      price: Number(price) || 0,
      currency: currency || 'INR',
      thumbnail: thumbnail || '',
      heroImage: heroImage || '',
      brochureUrl: brochureUrl || '',
      hasBrochure: hasBrochure !== undefined ? Boolean(hasBrochure) : true,
      batchNumber: batchNumber || '',
      startDate: startDate || null,
      workshopTime: workshopTime || '',
      duration: duration || '',
      durationDetail: durationDetail || '',
      fee: fee || '',
      feeNote: feeNote || '',
      eligibility: eligibility || '',
      eligibilityDetail: eligibilityDetail || '',
      applicationDeadline: applicationDeadline || null,
      tags: Array.isArray(tags) ? tags.filter(Boolean) : [],
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      highlights: highlights || [],
      modules: modules || [],
      targetAudience: targetAudience || [],
      learningOutcomes: learningOutcomes || [],
      experts: experts || [],
      slots: slots || [],
    };

    // Allow manual slug override
    if (slug && slug.trim()) {
      workshopData.slug = slug.trim().toLowerCase().replace(/\s+/g, '-');
    }

    const workshop = new Workshop(workshopData);
    await workshop.save();

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

    const allowedFields = [
      'title', 'subtitle', 'description', 'instructor',
      'price', 'currency', 'thumbnail', 'heroImage', 'brochureUrl', 'hasBrochure',
      'batchNumber', 'startDate', 'workshopTime', 'duration', 'durationDetail',
      'fee', 'feeNote', 'eligibility', 'eligibilityDetail',
      'applicationDeadline', 'tags', 'isActive',
      'highlights', 'modules', 'targetAudience', 'learningOutcomes',
      'experts', 'slots', 'slug',
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
      { isActive: false },
      { new: true }
    );

    if (!workshop) {
      return res.status(404).json({ success: false, message: 'Workshop not found' });
    }

    res.status(200).json({ success: true, message: 'Workshop deactivated successfully' });
  } catch (error) {
    console.error('Delete Workshop Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── Admin: List ALL workshops (including inactive) ───────────
exports.adminListWorkshops = async (req, res) => {
  try {
    const { page = 1, limit = 100 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [workshops, total] = await Promise.all([
      Workshop.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v'),
      Workshop.countDocuments({}),
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
