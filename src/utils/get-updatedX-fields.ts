const getUpdatedXFields = (user: { id: string }) => {
  return {
    updatedAt: new Date(),
    updatedBy: user.id,
  };
};

export { getUpdatedXFields };
