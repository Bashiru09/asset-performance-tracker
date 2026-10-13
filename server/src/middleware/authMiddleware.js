const supabase = require('../lib/supabase')

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Authentication required',
    })
  }

  const token = authHeader.split(' ')[1]

  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user) {
    return res.status(401).json({
      message: 'Invalid or expired token',
    })
  }

  req.user = data.user

  next()
}

module.exports = authMiddleware