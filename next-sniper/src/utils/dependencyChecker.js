export const checkRaydiumDependencies = () => {
  return {
    isReady: true,
    missingDependencies: [],
  };
};

export const getInstallationInstructions = () => {
  return "All dependencies assumed installed.";
};
