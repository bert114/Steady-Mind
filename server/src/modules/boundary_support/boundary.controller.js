import { generateBoundaryMessage } from "./boundary.service.js";

export const handleGenerateBoundary = async (req, res, next) => {
  try {
    const { situation } = req.body;
    const result = await generateBoundaryMessage(situation);

    console.log(req.body);

    return res.status(200).json({
      status: "success",
      data: {
        boundaryMessage: result.message,
        source: result.source,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
