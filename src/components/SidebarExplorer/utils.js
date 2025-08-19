export const getStageIcon = (stage) => {
  const icons = {
    'Expert Engineer': 'pi-code',
    'System Designer': 'pi-sitemap',
    'Leader': 'pi-users',
    'Review & Synthesis': 'pi-file-edit'
  };
  return icons[stage] || 'pi-file';
};

export const getStageTitle = (stage) => stage;
