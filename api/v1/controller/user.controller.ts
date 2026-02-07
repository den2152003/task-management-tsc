import md5 from "md5";
import { Request, Response } from "express";

import User from "../model/user.model";
import ForgotPassword from "../model/forgot-password.model";

import * as generateHelper from "../../../helper/generate";
import sendMail from "../../../helper/sendMail";   

// // const sendMailHelper = require("../../../helper/sendMail.js");

export const register = async (req: Request, res: Response) => {
    req.body.password = md5(req.body.password);

    const emailExit = await User.findOne({ email: req.body.email });

    if (!emailExit) {
        const token = generateHelper.generateRandomString(20);
        req.body.token = token; // Thêm token vào body
        const user = new User(req.body);
        await user.save();

        res.cookie("token", token);

        res.json({
            code: 200,
            message: "thành công",
            token: token
        });
    } else {
        res.json({
            code: 200,
            message: "Đã tồn tại"
        });
    }
};

export const login = async (req: Request, res: Response) => {
    const user = await User.findOne({
        email: req.body.email,
        deleted: false
    });

    if (!user) {
        res.json({
            code: 200,
            message: "Không tìm thấy email"
        });
        return;
    }

    if (md5(req.body.password) != user.password) {
        res.json({
            code: 200,
            message: "Sai mật khẩu"
        });
        return;
    }

    res.cookie("token", user.token);

    res.json({
        code: 200,
        message: "Đăng nhập thành công",
        token: user.token
    });
};


export const forgotPassword = async (req: Request, res: Response) => {
    const email = req.body.email;

    const user = await User.findOne({
        deleted: false,
        email: email
    })

    if (!user) {
        res.json({
            code: 400,
            message: "Không tìm thấy email"
        });
        return;
    }

    // OTP
    const otp = generateHelper.generateRandomNumber(8);

    const forgotPasswordSchema = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    }

    const forgotPassword = new ForgotPassword(forgotPasswordSchema);

    await forgotPassword.save();
    // End OTP
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `
        Mã OTP xác minh lấy lại mật khẩu là <b>${otp}. Thời hạn sử dụng là 3 phút. Lưu ý không được để lộ mã OTP.
    `;

    sendMail(email, subject, html);

    res.json({
        code: 200,
        message: "Đã gửi otp"
    });
}

export const otpPassword = async (req: Request, res: Response) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });

    if (!result) {
        res.json({
            code: 400,
            message: "otp k hợp lệ"
        });
        return;
    }

    const user = await User.findOne({
        deleted: false,
        email: email
    })

    res.cookie("token", user.token);

    res.json({
        code: 200,
        message: "mã xác thực thành công",
        token: user.token
    });
}

export const resetPassword = async (req: Request, res: Response) => {
    const token = req.body.token;
    const password = req.body.password;

    const user = await User.findOne({
        token: token
    });

    if (!user) {
        res.json({
            code: 400,
            message: "Không có tài khoản"
        });
        return;
    }

    if (md5(password) == user.password) {
        res.json({
            code: 400,
            message: "Vui lòng nhập mật khẩu khác mật khẩu cũ",
        });
    };

    await User.updateOne({ token: token }, { password: md5(password) });

    res.json({
        code: 200,
        message: "đổi mật khẩu thành công",
    });
}

export const detail = async (req: Request, res: Response) => {
    res.json({
        code: 200,
        message: "detail thành công",
        info: req["user"]
    });
}

export const list = async (req: Request, res: Response) => {
  const users = await User.find({ deleted: false }).select("fullName email");

  res.json({
    code: 200,
    message: "Thành công!",
    users: users
  });
};