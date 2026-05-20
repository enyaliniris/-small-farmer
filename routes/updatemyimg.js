const express = require("express");
const router = express.Router();
const db = require("./../modules/db_connect");
const multer = require("multer");
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'avatar',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
})

const upload = multer({ storage })

router.post("/upload", upload.single("file"), async (req, res) => {
  if (res.locals.bearer.sid && res.locals.bearer.account) {
    const sid = res.locals.bearer.sid
    const img = req.file.path 

    const sql_memberimg = `UPDATE members SET member_img = ? WHERE sid = ?`
    await db.query(sql_memberimg, [img, sid])

    const [r_sql_member] = await db.query(`SELECT * FROM members WHERE sid=?`, [sid])
    res.json(r_sql_member[0] || {})
  }
})
// const storage = multer.diskStorage({
//   destination:(req,file,cb)=>{
//     cb(null,__dirname+'/../public/images/avatar')
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const name = `${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`;
//     cb(null, name);
//   }
// });

// const upload = multer({ storage });

// // POST請求處理程序
// router.post("/upload", upload.single("file"), async (req, res) => {
//   if (res.locals.bearer.sid && res.locals.bearer.account) {
//     const sid = res.locals.bearer.sid;
//     // console.log(req.body.sid);
//     // const sid = req.body.sid;
//     const img = req.file.filename;
//     console.log(req.file.filename); // access uploaded file using req.file

//     const sql_memberimg = `UPDATE members SET member_img = ? WHERE sid = ${sid}`;
//     const [result] = await db.query(sql_memberimg, [img]);
//     // res.send('File uploaded!');
//     const sql_member = `SELECT * FROM members WHERE sid=${sid}`;
//     const [r_sql_member] = await db.query(sql_member);
//     let finalresult = {};
//     if (r_sql_member.length) {
//       finalresult = r_sql_member[0];
//     }
//     res.json(finalresult);
//   }
// });


router.post("/myImg", async (req, res) => {
  if (!res.locals.bearer) return res.status(401).json({ error: "未授權" });
  
  const myAuth = req.body.myAuth;
  
  if (!myAuth || !myAuth.accountId) {
    return res.status(400).json({ error: "缺少 accountId" });
  }

  try {
    const sql_myimg = `SELECT member_img FROM members WHERE sid=?`;
    const [r_sql_myimg] = await db.query(sql_myimg, [myAuth.accountId]);
    
    const result = r_sql_myimg[0] || {}
    console.log("img", result);
    res.json(result);
    
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "伺服器錯誤" })
  }
});


module.exports = router;




