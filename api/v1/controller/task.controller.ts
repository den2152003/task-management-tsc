import { Request, Response } from "express";

import Task from "../model/task.model";
import User from "../model/user.model";

import paginationHelper from "../../../helper/pagination";
import searchHelper from "../../../helper/search";
// const paginationHelper = require("../../../helper/pagination.js");
// const searchHelper = require("../../../helper/search.js");

export const index = async (req: Request, res: Response) => {
    interface Find {
        deleted: boolean,
        status?: string,
        title?: RegExp
    }
    const find: Find = {
        deleted: false
    };
    // const find = {
    //     $or:{
    //         createdBy: req.user.id,
    //         listUser: req.user.id
    //     },
    //     deleted: false
    // };

    if (req.query.status)
        find.status = req.query.status.toString();

    const sort = {};

    if (req.query.sortKey && req.query.sortValue){
        const sortKey = req.query.sortKey.toString();
        sort[sortKey] = req.query.sortValue;
    }
        

    let initPagination = {
        currentPage: 1,
        limitItem: 2
    };

    const countTask = await Task.countDocuments(find);

    let objectPagination = paginationHelper(initPagination, req.query, countTask);

    const objectSearch = searchHelper(req.query);

    if (objectSearch.reg) {
        find.title = objectSearch.reg;
    }

    const task = await Task.find(find)
        .sort(sort)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip);

    res.json(task);
};

export const detail = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const task = await Task.findOne({
            _id: id,
            deleted: false
        });

        res.json(task);
    } catch (error) {
        res.json("Không tìm thấy!");
    }
};

export const changeStatus = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const status = req.body.status;
        await Task.updateOne({ _id: id }, { status: status });

        res.json({
            code: 200,
            message: "cập nhật thành công"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tìm thấy!"
        });
    }
};

export const changeMulti = async (req: Request, res: Response) => {
    try {
        enum Key {
            STATUS = "status",
            DELETE = "delete"
        }

        const { ids, key, value } = req.body;

        switch (key) {
            case Key.STATUS:
                await Task.updateMany({
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
                await Task.updateMany({
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


    } catch (error) {
        res.json({
            code: 400,
            message: "Không tìm thấy!"
        });
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        if (req.body.id == "") {
            const countTasks = await Task.countDocuments();
            req.body.id = countTasks + 1;
        } else {
            req.body.id = parseInt(req.body.id);
        }

        // req.body.createdBy = req.user.id;

        const task = new Task(req.body);

        const data = await task.save();

        res.json({
            code: 200,
            message: "Thành công!",
            data: data
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tìm thấy!"
        });
    }
};

export const edit = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        await Task.updateOne({_id: id}, req.body);

        res.json({
            code: 200,
            message: "Thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tìm thấy!"
        });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        await Task.updateOne({
            _id: id
        }, {
            deleted: true,
            deletedAt: new Date()
        });

        res.json({
            code: 200,
            message: "Thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tìm thấy!"
        });
    }
};