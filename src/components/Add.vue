<template>
    <div id="add-form">
        <label for="type">类型:</label>
        <input type="radio" v-model="form.type" name="type-1" id="type-1" :value="1">
        <label for="type-1">收入</label>
        <input type="radio" v-model="form.type" name="type-0" id="type-0" :value="0">
        <label for="type-0">支出</label>
        <br>
        <label for="time">日期:</label>
        <input type="number" v-model="date.Y" style="width: 50px;">年
        <input type="number" v-model="date.M" style="width: 50px;">月
        <input type="number" v-model="date.D" style="width: 50px;">日

        <br>
        <label for="category">选择分类:</label>
        <select name="category" id="category" v-model="form.category">
            <option v-for="item in categoriesList" :key="item.id" :label="item.name" :value="item.id"></option>
        </select>
        <br>
        <label for="amount">
            金额:
        </label>
        <input type="number" id="amout" v-model="form.amount">￥
        <br>
        <p>
            <button @click="add">新增</button>
            <button @click="reset">重置</button>
        </p>

    </div>
</template>

<script setup lang="ts">
import { defineComponent, reactive, watch, watchEffect } from 'vue';
import { EnumPayType, TypeBillItem } from '../types/bill'
import categoriesList from '../assets/categories.json'
defineComponent({
    name: 'Add'
})
// 声明对外emit
const emit = defineEmits<{
    (e: 'add', data: TypeBillItem): void
}>()
const form = reactive<TypeBillItem>({
    type: EnumPayType.支出,
    time: '',
    category: '',
    amount: 0,
})
const current = new Date();
const date = reactive({
    Y: current.getFullYear(),
    M: current.getMonth() + 1,
    D: current.getDate()
})
// 监听date里的变化,赋值给form.time
watchEffect(()=>{
    form.time = String(new Date(`${date.Y}-${date.M}-${date.D} 00:00:00`).getTime())
})
// 对外触发 add 事件
const add = () => {
    emit('add', form);
}
// 清除表单
const reset = () => {
    form.time = '';
    form.category = '';
    form.amount = 0;
}
</script>

<style scoped>
</style>