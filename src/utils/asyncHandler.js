const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        })
    }
}

export { asyncHandler }

// Below is the Alternative code for above but i prefer above one but below is equally important
// const asyncHandler = (requestHandler) => {
//     (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next)).catch((error) => next(error));
//     }
// }