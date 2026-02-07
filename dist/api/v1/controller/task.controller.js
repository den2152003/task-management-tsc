"use strict";
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
exports.deleteTask = exports.edit = exports.create = exports.changeMulti = exports.changeStatus = exports.detail = exports.index = void 0;
const task_model_1 = __importDefault(require("../model/task.model"));
const pagination_1 = __importDefault(require("../../../helper/pagination"));
const search_1 = __importDefault(require("../../../helper/search"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const find = {
        deleted: false
    };
    if (req.query.status)
        find.status = req.query.status.toString();
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey.toString();
        sort[sortKey] = req.query.sortValue;
    }
    let initPagination = {
        currentPage: 1,
        limitItem: 2
    };
    const countTask = yield task_model_1.default.countDocuments(find);
    let objectPagination = (0, pagination_1.default)(initPagination, req.query, countTask);
    const objectSearch = (0, search_1.default)(req.query);
    if (objectSearch.reg) {
        find.title = objectSearch.reg;
    }
    const task = yield task_model_1.default.find(find)
        .sort(sort)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip);
    res.json(task);
});
exports.index = index;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const task = yield task_model_1.default.findOne({
            _id: id,
            deleted: false
        });
        res.json(task);
    }
    catch (error) {
        res.json("Không tìm thấy!");
    }
});
exports.detail = detail;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const status = req.body.status;
        yield task_model_1.default.updateOne({ _id: id }, { status: status });
        res.json({
            code: 200,
            message: "cập nhật thành công"
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Không tìm thấy!"
        });
    }
});
exports.changeStatus = changeStatus;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let Key;
        (function (Key) {
            Key["STATUS"] = "status";
            Key["DELETE"] = "delete";
        })(Key || (Key = {}));
        const { ids, key, value } = req.body;
        switch (key) {
            case Key.STATUS:
                yield task_model_1.default.updateMany({
                    _id: { $in: ids }
                }, {
                    status: value
                });
                res.json({
                    code: 200,
                    message: "cập nhật thành công"
                });
                break;
            case Key.DELETE:
                yield task_model_1.default.updateMany({
                    _id: { $in: ids }
                }, {
                    deleted: true,
                    deletedAt: new Date()
                });
                res.json({
                    code: 200,
                    message: "Xóa thành công"
                });
                break;
        }
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Không tìm thấy!"
        });
    }
});
exports.changeMulti = changeMulti;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.id == "") {
            const countTasks = yield task_model_1.default.countDocuments();
            req.body.id = countTasks + 1;
        }
        else {
            req.body.id = parseInt(req.body.id);
        }
        const task = new task_model_1.default(req.body);
        const data = yield task.save();
        res.json({
            code: 200,
            message: "Thành công!",
            data: data
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Không tìm thấy!"
        });
    }
});
exports.create = create;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield task_model_1.default.updateOne({ _id: id }, req.body);
        res.json({
            code: 200,
            message: "Thành công!"
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Không tìm thấy!"
        });
    }
});
exports.edit = edit;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield task_model_1.default.updateOne({
            _id: id
        }, {
            deleted: true,
            deletedAt: new Date()
        });
        res.json({
            code: 200,
            message: "Thành công!"
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Không tìm thấy!"
        });
    }
});
exports.deleteTask = deleteTask;
