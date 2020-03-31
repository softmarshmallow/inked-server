import {FilterOperationType, ValueType} from "../../generated/prisma-client";

interface Spec {
    field: string
    options: FilterOperationType[]
    type: ValueType
    many: boolean
}

export {
    Spec
}
