import apiClient from './client';

export interface WorkshopSlot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  totalSeats: number;
  bookedSeats: number;
  isAvailable: boolean;
  meetingLink: string;
}

export interface WorkshopModule {
  title: string;
  content: string[];
}

export interface WorkshopHighlight {
  title: string;
  description: string;
}

export interface WorkshopTargetAudience {
  title: string;
  description: string;
}

export interface WorkshopExpert {
  name: string;
  role: string;
  image: string;
}

export interface Workshop {
  _id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  instructor: string;
  price: number;
  currency: string;
  thumbnail: string;
  tags: string[];
  isActive: boolean;
  slots: WorkshopSlot[];
  createdAt: string;

  // Detail page fields
  batchNumber: string;
  startDate: string | null;
  duration: string;
  durationDetail: string;
  fee: string;
  feeNote: string;
  eligibility: string;
  eligibilityDetail: string;
  applicationDeadline: string | null;
  heroImage: string;
  brochureUrl: string;

  // Rich content
  highlights: WorkshopHighlight[];
  modules: WorkshopModule[];
  targetAudience: WorkshopTargetAudience[];
  learningOutcomes: string[];
  experts: WorkshopExpert[];
}

interface WorkshopListResponse {
  success: boolean;
  data: {
    workshops: Workshop[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

interface WorkshopDetailResponse {
  success: boolean;
  data: {
    workshop: Workshop;
  };
}

const demoWorkshop: Workshop = {
  _id: 'demo-1',
  title: 'Advanced AI Strategies for 2026',
  slug: 'demo',
  subtitle: 'Learn how to leverage AI tools to scale your operations, reduce costs, and stay ahead of the competition.',
  description: 'A comprehensive live workshop on building AI agents and workflows for modern businesses.',
  instructor: 'Dr. Sarah Connor',
  price: 2999,
  currency: 'INR',
  thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  tags: ['AI', 'Business', 'Growth'],
  isActive: true,
  slots: [],
  createdAt: new Date().toISOString(),
  batchNumber: 'BATCH 04',
  startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  duration: '4 Weeks',
  durationDetail: '2 hours per session, weekends',
  fee: '₹2,999',
  feeNote: 'Includes certification and lifelong access to materials',
  eligibility: 'Business Owners, Managers, and Tech Leads',
  eligibilityDetail: 'No prior coding experience required.',
  applicationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
  heroImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  brochureUrl: '',
  highlights: [
    { title: 'Live Interactive Sessions', description: 'Real-time Q&A with experts.' },
    { title: 'Hands-on Projects', description: 'Build your own AI agents.' },
    { title: 'Industry Recognized Certificate', description: 'Boost your resume.' },
    { title: '1-on-1 Mentorship', description: 'Personalized guidance.' },
  ],
  modules: [
    { title: 'Module 1: Introduction to AI in Business', content: ['Understanding LLMs', 'Identifying use cases in your business', 'ROI calculation for AI tools'] },
    { title: 'Module 2: Building AI Agents', content: ['Introduction to LangChain', 'Deploying agents', 'Monitoring and scaling'] },
    { title: 'Module 3: Advanced Workflows', content: ['Automating customer support', 'AI in marketing', 'Predictive analytics'] },
  ],
  targetAudience: [
    { title: 'Entrepreneurs', description: 'Founders looking to scale with AI.' },
    { title: 'Product Managers', description: 'PMs wanting to integrate AI into products.' },
  ],
  learningOutcomes: [
    'Understand the core principles of AI agents.',
    'Be able to build and deploy custom AI solutions.',
    'Calculate ROI for AI investments.',
    'Streamline business operations using automation.',
  ],
  experts: [
    { name: 'Dr. Sarah Connor', role: 'Chief AI Scientist', image: '' },
    { name: 'John Doe', role: 'AI Engineering Lead', image: '' },
  ],
};

export const workshopApi = {
  list: async (params?: { page?: number; limit?: number; tag?: string }) => {
    // Return mock data for UI testing
    return {
      success: true,
      data: {
        workshops: [demoWorkshop],
        pagination: { page: 1, limit: 10, total: 1, pages: 1 }
      }
    };
  },

  get: async (id: string) => {
    return {
      success: true,
      data: { workshop: demoWorkshop }
    };
  },

  getBySlug: async (slug: string) => {
    return {
      success: true,
      data: { workshop: { ...demoWorkshop, slug } }
    };
  },

  create: async (data: Omit<Partial<Workshop>, 'slots'> & { slots?: Partial<WorkshopSlot>[] }) => {
    const res = await apiClient.post('/workshops', data);
    return res.data;
  },

  update: async (id: string, data: Omit<Partial<Workshop>, 'slots'> & { slots?: Partial<WorkshopSlot>[] }) => {
    const res = await apiClient.patch(`/workshops/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await apiClient.delete(`/workshops/${id}`);
    return res.data;
  },
};
