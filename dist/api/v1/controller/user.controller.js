"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = exports.detail = exports.resetPassword = exports.otpPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const md5_1 = __importDefault(require("md5"));
const user_model_1 = __importDefault(require("../model/user.model"));
const forgot_password_model_1 = __importDefault(require("../model/forgot-password.model"));
const generateHelper = __importStar(require("../../../helper/generate"));
const sendMail_1 = __importDefault(require("../../../helper/sendMail"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.password = (0, md5_1.default)(req.body.password);
    const emailExit = yield user_model_1.default.findOne({ email: req.body.email });
    if (!emailExit) {
        const token = generateHelper.generateRandomString(20);
        req.body.token = token;
        const user = new user_model_1.default(req.body);
        yield user.save();
        res.cookie("token", token);
        res.json({
            code: 200,
            message: "thành công",
            token: token
        });
    }
    else {
        res.json({
            code: 200,
            message: "Đã tồn tại"
        });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({
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
    if ((0, md5_1.default)(req.body.password) != user.password) {
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
});
exports.login = login;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const user = yield user_model_1.default.findOne({
        deleted: false,
        email: email
    });
    if (!user) {
        res.json({
            code: 400,
            message: "Không tìm thấy email"
        });
        return;
    }
    const otp = generateHelper.generateRandomNumber(8);
    const forgotPasswordSchema = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    };
    const forgotPassword = new forgot_password_model_1.default(forgotPasswordSchema);
    yield forgotPassword.save();
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `
        Mã OTP xác minh lấy lại mật khẩu là <b>${otp}. Thời hạn sử dụng là 3 phút. Lưu ý không được để lộ mã OTP.
    `;
    (0, sendMail_1.default)(email, subject, html);
    res.json({
        code: 200,
        message: "Đã gửi otp"
    });
});
exports.forgotPassword = forgotPassword;
const otpPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const otp = req.body.otp;
    const result = yield forgot_password_model_1.default.findOne({
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
    const user = yield user_model_1.default.findOne({
        deleted: false,
        email: email
    });
    res.cookie("token", user.token);
    res.json({
        code: 200,
        message: "mã xác thực thành công",
        token: user.token
    });
});
exports.otpPassword = otpPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.body.token;
    const password = req.body.password;
    const user = yield user_model_1.default.findOne({
        token: token
    });
    if (!user) {
        res.json({
            code: 400,
            message: "Không có tài khoản"
        });
        return;
    }
    if ((0, md5_1.default)(password) == user.password) {
        res.json({
            code: 400,
            message: "Vui lòng nhập mật khẩu khác mật khẩu cũ",
        });
    }
    ;
    yield user_model_1.default.updateOne({ token: token }, { password: (0, md5_1.default)(password) });
    res.json({
        code: 200,
        message: "đổi mật khẩu thành công",
    });
});
exports.resetPassword = resetPassword;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({
        code: 200,
        message: "detail thành công",
        info: req["user"]
    });
});
exports.detail = detail;
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.find({ deleted: false }).select("fullName email");
    res.json({
        code: 200,
        message: "Thành công!",
        users: users
    });
});
exports.list = list;
