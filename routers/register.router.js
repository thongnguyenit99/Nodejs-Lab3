const router = require('express').Router();
const config = require('../config/config.json');
const userModel = require('../models/users.model');
const md5 = require('md5');
const multer = require('multer')
const upload = multer({ dest: './public/uploads/' })

// router.route('/')
//     .get((req, res) => {
//         res.render('home');
//     })
//     .post((req, res) => {
//         const check = req.body.attend === "on" ? "true" : "false";
//         const name = req.body.name;
//         const objUser = {
//             name: req.body.name,
//             gmail: req.body.gmail,
//             attend: check
//         }
//         config.listUser.push(objUser);
//         objUser.attend === "true" ? res.render('req', { ...config.titleSuccess, name }) : res.render('req', { ...config.titlefail, name });
//     })
router.get('/', (req, res) => {
    res.render('home')
})
router.get('/home', (req, res) => {
    res.render('home');
})

router.get('/login',(req, res) => {
        const cookieLoginAd = req.cookies.adminLogin;
        cookieLoginAd ? res.render('admin/home', { layout: 'homeAdmin.hbs' }) : res.render('loginAdmin'
        );
    })
router.post(('/login'),async (req, res) => {
        const adminReq = req.body;
        const accountAdmin = await userModel.selectAdmin(+adminReq.f_Permission);
        const pwhash = md5(req.body.f_Password);
    if (accountAdmin[0].f_Username == adminReq.f_Username && accountAdmin[0].f_Password == pwhash)
    {
            req.body.checkBox === "on" && res.cookie("adminLogin", "success", { maxAge: 1000 * 30 });
            res.render('admin/home', {
                layout: 'homeAdmin.hbs'
            })
    }
    else {
        res.send('Bạn hãy nhập đúng thông tin nhen !!!!');
    }
    console.log(req.body);
    console.log(pwhash);
    
   
    })
router.get(('/admin/list'), async (req, res) => {
    const listUser = await userModel.selectAdmin(1);
    res.render('admin/list', {
        layout: 'homeAdmin.hbs',
        listUser
    })
})
router.route('/admin/config')
    .get((req, res) => {
        const titleSuccess = config.titleSuccess.title;
        const titleHome = config.titleSuccess.titleHome;
        const titlefail = config.titlefail.title;
        res.render('admin/config', { titleSuccess, titleHome, titlefail, layout: 'homeAdmin.hbs' });
    })
    .post((req, res) => {
        config.titleSuccess.title = req.body.titleSuccess;
        config.titleSuccess.titleHome = req.body.titleHome;
        config.titlefail.title = req.body.titlefail;
        res.render('admin/config', {
            layout: 'homeAdmin.hbs', success: "Chỉnh sửa thành công", fail: "chỉnh sửa thất bại"
        });
    })

router.get(('/admin/profile'), async (req, res) => {
    const admin = await userModel.selectAdmin(0);
    accountAdmin = admin[0];
    res.render('admin/profile', { accountAdmin, layout: 'homeAdmin.hbs' });
})

router.post(('/admin/profile'), upload.single('f_Avatar'), async (req, res) => {
    const accoutnAdmin = await userModel.selectAdmin(0);
    if (req.file) {
        if (req.body.f_Password !== accoutnAdmin[0].f_Password) {
            req.body.f_Password = md5(req.body.f_Password);
        }
        const objMulter = {
            ...req.body, f_Avatar: req.file.filename
        }
        const updataAdmin = await userModel.updataAdmin(objMulter);
        res.render('admin/home', {
            layout: 'homeAdmin.hbs'
        });
    } else {
        if (req.body.f_Password !== accoutnAdmin[0].f_Password) {
            req.body.f_Password = md5(req.body.f_Password);
        }
        const objMulter = {
            ...req.body, f_Avatar: accoutnAdmin[0].f_Avatar
        }
        const updataAdmin = await userModel.updataAdmin(objMulter);
        res.render('admin/home', {
            layout: 'homeAdmin.hbs'
        });
    }


})
router.get('/reg.html', (req, res) => {
    res.render('users/reg')
})
router.post('/reg', upload.single('f_Avatar'), async (req, res) => {
    const attend = req.body.attend;
    const hashPw = md5(req.body.f_Password);
    req.body.f_Password = hashPw;

    console.log(req.body);
    
    if (req.file) {
        const name = req.body.f_Name;
        const objMulter = {
            ...req.body, f_Avatar: req.file.filename,attend:req.body.attend

        }
       
        if (attend === "on") {
            attend === "True"
            res.render('req', { ...config.titleSuccess, name, layout: 'main.hbs' })
            const insertUser = await userModel.insertUser(objMulter);
        }
        else {
            attend === "False"
        } res.render('req', { ...config.titlefail, name });
        const insertUser = await userModel.insertUser(objMulter);

    }
    else {
        const infoSignup = {
            msg: "Bạn phải điền thông tin nhé!!! ^-^"
        }
        res.render('users/reg', { infoSignup });
    }
})


module.exports = router;