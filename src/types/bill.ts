export type TypeBillItem = {
    type: number,
    time: string,
    category: string,
    amount: number,
    mouth?: number, // 前端辅助类型
}
export type TypeCategoryItem = {
    id: string,
    name: string
    type: number,
}
export enum EnumPayType {
    '收入' = 1,
    '支出' = 0,
}