<template>
    <div>
        <div id="form">
            <label for="mouth">月份选择:</label>
            <select v-model="form.mouth" name="mouth" id="mouth" @change="filter">
                <option :value="0" label="全部"></option>
                <option v-for="i in 12" :key="i" :label="`${i}月`" :value="i"></option>
            </select>
            <label for="category">分类:</label>
            <select v-model="form.category" name="category" id="category" @change="filter">
                <option value="" label="全部"></option>
                <option v-for="(item, i) in categoriesList" :key="i" :label="item.name" :value="item.id"></option>
            </select>
            <label for="category">账单类型:</label>
            <select v-model="form.type" name="category" id="category" @change="filter">
                <option :value="-1" label="全部"></option>
                <option :value="EnumPayType.支出" label="支出"></option>
                <option :value="EnumPayType.收入" label="收入"></option>
            </select>
            <!-- <button @click="filter">查询</button> -->
            <br>
            <br>
            <label for="upload">重新上传账单csv</label>
            <input name="upload" type="file" id="file" @change="upload">
        </div>

        <p>
            <span>总支出: <span style="color: green">{{ incomeAndPay.pay }}</span>￥</span>
            <br>
            <span>总收入: <span style="color: red">{{ incomeAndPay.income }}</span></span>
        </p>
        <p>
        <p v-for="(value, key ) in categoryPayTotal" :key="key">{{ categoryArray[key].name }}: {{ value }}￥</p>
        </p>
        <table id="table" >
            <thead>
                <tr>
                    <th>类型</th>
                    <th>时间</th>
                    <th>分类</th>
                    <th>金额</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, i) in tableList" :key="i">
                    <td>{{ EnumPayType[item.type] }}</td>
                    <td>{{ formatTimestampInsertMouth(item.time, item) }}</td>
                    <td>{{ findCategory(item.category).name }}</td>
                    <td>{{ item.amount }}￥</td>
                </tr>
            </tbody>
        </table>
        <br>
        <Add @add="add"></Add>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import Add from './Add.vue'
import { formatTimestamp } from '../utils'
import categoriesList from '../assets/categories.json'
import staticBillList from '../assets/bill.json'; // 页面自有的演示数据
import { computed } from '@vue/reactivity';
import { TypeBillItem, TypeCategoryItem, EnumPayType } from '../types/bill'
let billList = staticBillList;
// 表单过滤
const form = reactive({
    mouth: 0, // 月份选择
    category: '', // 分类筛选
    type: -1, //
})
// 账单列表
const tableList = ref<TypeBillItem[]>(billList)
// 分类列表
const categoryList: TypeCategoryItem[] = categoriesList
const categoryPayTotal = ref<any>({});
// id为key,方便查找
const categoryArray: any = {};
categoryList.forEach(v => {
    categoryArray[v.id] = v
})
// 查分类名
const findCategory = (categoryId: string) => {
    return categoryArray[categoryId] || { name: '未知' }
}

// 条件查询
const filter = () => {
    const { mouth, category, type } = form;
    categoryPayTotal.value = {}
    tableList.value = billList.filter((item: TypeBillItem) => {
        let match = true;
        if (mouth) {
            if (mouth === item.mouth) {
                match = true
            } else {
                match = false
                return match
            }
        }
        if (category) {
            match = false
            if (category === item.category) {
                match = true
            } else {
                match = false
                return match
            }
        }
        if (type >= 0) {
            match = false
            if (type === item.type) {
                match = true
            } else {
                match = false
                return match
            }
        }
        // 附加: 顺带统计下各个分类的[支出]金额统计
        if (item.type === EnumPayType.支出 && match) {
            //    setCategoryTotal(item)
        }
        return match
    }).sort((a, b) => b.amount - a.amount)
}
// 计算月份计算后的账单分类总支出
const setCategoryTotal = (item: TypeBillItem) => {
    if (categoryPayTotal.value[item.category] == undefined) {
        categoryPayTotal.value[item.category] = 0;
    }
    categoryPayTotal.value[item.category] += item.amount
}
// 上传的csv文件转成obj
const transformBillList = (csvString: string) => {
    let list = csvString.split('\n');
    let header = list.splice(0, 1)[0]; // type,time,category,amount
    let keyList = header.split(',') //['type', 'time', ...]
    let intKeys = ['type', 'amount',] // 对某些字段进行特殊处理,搞成整型
    return list.map((v) => {
        let row = v.split(',') // ['0','1561910400000','8s0p77c323','5400']
        let item: any = {};
        keyList.forEach((k, i) => {
            item[k] = row[i] || '';
            if (intKeys.includes(k)) {
                item[k] = Number(item[k])
            }
        });
        return item;
    })
}
// 给原来的列表注入mouth,不用再对比格式化时间了
const formatTimestampInsertMouth = (timestamp: string, item: TypeBillItem) => {
    let { date, format } = formatTimestamp(timestamp) // 格式化后时间
    // item.mouth = time.match(/^\d{4}-(\d+)/)[1]
    item.mouth = date.getMonth() + 1;
    return format
}
// 前端处理上传文件
const upload = (e: Event) => {
    let file = (e.target as any).files[0];
    let reader = new FileReader();
    // reader.readAsBinaryString(file);
    reader.readAsText(file, 'UTF-8')
    reader.onload = function (e) {
        const data = (e.currentTarget as any)?.result;
        const list = transformBillList(data);
        billList = list
        filter()
    }
}

// 新增账单
const add = (data: TypeBillItem) => {
    console.log('data', data)
    // 这里的amount元为单位需要换成分
    data.amount = data.amount * 100
    if (data) {
        // billList.push(data);
        tableList.value.push(data)
    }
}

// computer 计算列表内的支出和收入总数
const incomeAndPay = computed(() => {
    let income = 0;
    let pay = 0;
    tableList.value.forEach(i => {
        if (i.type === EnumPayType.支出) {
            pay += i.amount;
            if (form.mouth) {
                // 附加: 顺带统计下各个分类的[支出]金额统计
                setCategoryTotal(i)
            }
        } else if (i.type === EnumPayType.收入) {
            income += i.amount
        }
    })
    return { income, pay }
})
</script>

<style scoped>
thead tr {
    background-color: #eee;
    
}
tbody tr td {
    width: 200px;
    text-align: center
}
tbody tr:nth-child(odd){
    background-color: #ccc;
}
</style>