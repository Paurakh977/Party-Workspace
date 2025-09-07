// Utility functions for link validation and preview generation

export interface LinkPreview {
  title: string;
  description: string;
  thumbnail: string;
  domain: string;
  isValid: boolean;
}

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const getLinkType = (url: string): string => {
  if (!validateUrl(url)) return 'invalid';
  
  const domain = new URL(url).hostname.toLowerCase();
  
  if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
    return 'youtube';
  } else if (domain.includes('facebook.com') || domain.includes('fb.com')) {
    return 'facebook';
  } else if (domain.includes('instagram.com')) {
    return 'instagram';
  } else if (domain.includes('twitter.com') || domain.includes('x.com')) {
    return 'twitter';
  } else if (domain.includes('tiktok.com')) {
    return 'tiktok';
  } else if (domain.includes('linkedin.com')) {
    return 'linkedin';
  }
  
  return 'generic';
};

export const generateYouTubeThumbnail = (url: string): string => {
  try {
    const urlObj = new URL(url);
    let videoId = '';
    
    if (urlObj.hostname.includes('youtu.be')) {
      videoId = urlObj.pathname.slice(1);
    } else if (urlObj.hostname.includes('youtube.com')) {
      videoId = urlObj.searchParams.get('v') || '';
    }
    
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
  } catch (error) {
    console.error('Error generating YouTube thumbnail:', error);
  }
  
  return '';
};

export const generateLinkPreview = async (url: string): Promise<LinkPreview> => {
  if (!validateUrl(url)) {
    return {
      title: '',
      description: '',
      thumbnail: '',
      domain: '',
      isValid: false
    };
  }

  const linkType = getLinkType(url);
  const domain = new URL(url).hostname;
  
  // For YouTube, we can generate thumbnail directly
  if (linkType === 'youtube') {
    const thumbnail = generateYouTubeThumbnail(url);
    return {
      title: 'YouTube Video',
      description: 'YouTube video content',
      thumbnail,
      domain,
      isValid: true
    };
  }
  
  // For other platforms, we could implement oEmbed or other preview services
  // For now, return basic info
  return {
    title: `${linkType.charAt(0).toUpperCase() + linkType.slice(1)} Link`,
    description: `Content from ${domain}`,
    thumbnail: '',
    domain,
    isValid: true
  };
};

export const formatLinkName = (url: string): string => {
  const linkType = getLinkType(url);
  const domain = new URL(url).hostname;
  
  switch (linkType) {
    case 'youtube':
      return 'YouTube Video';
    case 'facebook':
      return 'Facebook Post';
    case 'instagram':
      return 'Instagram Post';
    case 'twitter':
      return 'Twitter Post';
    case 'tiktok':
      return 'TikTok Video';
    case 'linkedin':
      return 'LinkedIn Post';
    default:
      return `Link from ${domain}`;
  }
};
