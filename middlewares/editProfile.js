const canEditProfile = (req, res, next) => {
  const { id } = req.params;

  return req.user.id !== Number(id)
    ? res.status(401).send({
      status: 401,
      message: 'You are not allowed to edit this profile'
    })
    : next();
};
export default canEditProfile;
