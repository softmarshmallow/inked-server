import {Spec} from "./spec";


const newsSpecs: Spec[] = [
    {
        field: "title",
        type: 'TEXT',
        options: ["IS", "NOT", "CONTAINS", "NOT_CONTAINS"],
        many: false,
    },
    {
        field: "content",
        type: 'TEXT',
        options: ["CONTAINS", "NOT_CONTAINS"],
        many: false,
    },
    {
        field: "provider",
        type: 'TEXT',
        options: ["IS", "NOT"],
        many: false,
    },
    {
        field: "time",
        type: "TIME",
        options: ["GT", "GTE", "LT", "LTE"],
        many: false,
    },
];


const newsMetaSpecs : Spec[] = [
    {
        field: "source",
        type: "ENUM",
        options: ["IS", "NOT"],
        many: false,
    },
    {
        field: "summary",
        type: 'TEXT',
        options: ["CONTAINS", "NOT_CONTAINS", "STARTS_WITH", "NOT_STARTS_WITH"],
        many: false,
    },
    {
        field: "subject",
        type: 'TEXT',
        options: ["CONTAINS", "NOT_CONTAINS", "IS", "NOT"],
        many: false,
    },
    {
        field: "category",
        type: "ENUM",
        options: ["IS", "NOT"],
        many: false,
    },
    {
        field: "categories",
        type: "ENUM",
        options: ["IN", "NOT_IN"],
        many: true,
    },
];


export {
    newsSpecs,
    newsMetaSpecs
}
