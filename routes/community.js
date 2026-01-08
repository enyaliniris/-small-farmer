const express = require("express");

const db = require("./../modules/db_connect");

const router = express.Router();

//文章分頁
const getListData = async (req) => {
    let redirect = "";
    // 一頁有幾筆
    const perPage = 12;
    // 當前頁數 
    let page = +req.query.page || 1;
    //-----篩選&排序&檢索------
    let sqlWhere = "WHERE 1 ";
    let sqlCreatDate = " ORDER BY community_created_at DESC ";
    let queryObj = {};

    page = parseInt(page);
    if (page < 1) {
        redirect = req.baseUrl;
    }
    // 總筆數
    const [[{ totalRows }]] = await db.query(
        `SELECT COUNT(1) AS totalRows FROM community ${sqlWhere}`
    );

    // 總頁數
    const totalPages = Math.ceil(totalRows / perPage);
    let rows = [];
    if (totalRows > 0) {
        if (page > totalPages) {
            redirect = req.baseUrl + "?page=" + totalPages;
        }
        const sql = `SELECT * FROM \`community\` ${sqlWhere} ${sqlCreatDate} LIMIT 
      ${(page - 1) * perPage} , ${perPage} `;

        [rows] = await db.query(sql);
    }

    //取得所有文章列表
    let communityA = []
    const sql1 = `SELECT * FROM \`community\` LEFT JOIN members ON  members.sid = community.member_sid`;
    [communityA] = await db.query(sql1);

  
    //取得該篇文章的按讚數
    let communitylike = []
    const sql2 = `SELECT COUNT(1) AS totalL FROM \`community\` JOIN community_liked ON  community.sid = community_liked.community_liked WHERE community.member_sid`;
    [communitylike] = await db.query(sql2);
    cmlike = communityA.map((v, i) => {
        return { ...v, like:communitylike }
    })

    return {
        page,
        perPage,
        totalRows,
        totalPages,
        communityA,
        cmlike,
        communitylike,
        sqlCreatDate,
        queryObj,
    };
}

const getMyCommunityData = async (req, res) => {
    const perPage = 4;
    let page = +req.query.page || 1;
    let totalPagesP;
    let totalPagesL;
    let totalP;

    if (res.locals.bearer.sid && res.locals.bearer.account) {
        // 有登入
        const member_sid = res.locals.bearer.sid;

        // 我的文章總筆數
        [[{ totalP }]] = await db.query(
            `SELECT COUNT(1) AS totalP FROM community WHERE \`community.member_sid\` = ${member_sid}`
        );
        // 文章總頁數
        totalPagesP = Math.ceil(totalP / perPage);

        const sql2 = `SELECT * FROM \`community\` WHERE \`community.member_sid\` = ${member_sid} `;
        [mycommunity] = await db.query(sql2);

    } else {
        // 沒登入
        console.log("沒登入喔");
        return;
    } return {
        page,
        totalP,
        totalPagesP,
        totalPagesL,
        mycommunity,
    }
}



//API路由
router.get("/", (req, res) => {
    res.send("討論區API");
});

//取得所有討論區資料
router.get("/api", async (req, res) => {
    res.json(await getListData(req));
});

//文章單頁資料
router.get("/:sid", async (req, res) => {
    res.json(await getMyCommunityData(req));
});

module.exports = router;