import { mapMoodToScore } from "./energy.utils.js";

const cleanData = (req, res, next) => {
  req.body.moodScore = mapMoodToScore(req.body.moodScore);

  next();
};

export { cleanData };
