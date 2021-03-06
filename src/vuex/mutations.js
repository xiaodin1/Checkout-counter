// 模块引入vue就可以使用vue的方法
// import Vue from 'vue' 

export default {
    // 登录部分
    setAccountName (state, name) {
        state.accountName = name;
    },

    // 商品入库部分
    // 添加新商品
    addShopping (state, newShopping) {
        state.shoppingList.push(newShopping);
    },
    // 添加新批次
    addShoppingBatch (state, obj) {
        state.shoppingList[obj.index].number = parseInt(state.shoppingList[obj.index].number) + parseInt(obj.batch.number);
        state.shoppingList[obj.index].date = obj.batch.date;
    },

    // 商品展示部分
    // 添加购物车商品
    addShoppingCart (state, shopping) {
        state.shoppingCartList.push(shopping);
        state.shoppingFlag.push(true);
        state.shoppingNumber.push(1);
    },
    // 改变购物车按钮数字显示
    trueShoppingCartListNumberFlag (state) {
        state.shoppingCartListNumberFlag = true;
    },
    falseShoppingCartListNumberFlag (state) {
        state.shoppingCartListNumberFlag = false;
    },

    // 购物车部分
    // 检查购物车中商品数量
    checkShoppingCartList (state) {
        if (state.shoppingCartList.length === 0) {
            state.shoppingCartListNumberFlag = false;
            state.shoppingCartFlag = 'noShopping';
        } else {
            state.shoppingCartListNumberFlag = true;
            state.shoppingCartFlag = 'hasShopping';
        }
    },
    // 更改商品选中状态
    changeShoppingFlag (state, index) {
        // 用索引直接更改数组值，vue不会重新渲染
        // state.shoppingFlag[index] = !state.shoppingFlag[index];
        state.shoppingFlag.splice(index, 1, !state.shoppingFlag[index]);
    },
    // 更改商品数量
    changeShoppingCartNumber (state, obj) {
        // 用索引直接更改数组值，vue不会重新渲染
        // state.shoppingNumber[obj.index] = obj.num;
        //  两种方法解决，变异方法，数组调用改变原数组的方法
        state.shoppingNumber.splice(obj.index, 1, obj.num);
        // 第二种，使用vue的set，需要在模块中引入vue
        // Vue.set(state.shoppingNumber, obj.index, obj.num);
    },
    // 更改全选状体
    changeCheckAll (state) {
        state.checkAllFlag = !state.checkAllFlag; 
    },
    // 全选商品
    checkAllShopping (state) {
        for (let i = 0; i < state.shoppingFlag.length; i++) {
            state.shoppingFlag[i] = true;
        }
        state.shoppingFlag.splice(0, state.shoppingFlag.length, ...state.shoppingFlag);
    },
    // 全不选商品
    uncheckAllShopping (state) {
        for (let i = 0; i < state.shoppingFlag.length; i++) {
            state.shoppingFlag[i] = false;
        }
        state.shoppingFlag.splice(0, state.shoppingFlag.length, ...state.shoppingFlag);
    },
    // 删除购物车商品
    deleteShoppingCart (state, index) {
        state.shoppingCartList.splice(index, 1);
        state.shoppingFlag.splice(index, 1);
        state.shoppingNumber.splice(index, 1);
    },
    // 结算部分
    // 结算框显示隐藏
    changeCheckOutFlag (state) {
        let flag = false;
        for (let i = 0; i < state.shoppingFlag.length; i++) {
            if (state.shoppingFlag[i] === true) {
                flag = true;
            }
        }
        if (flag === true) {
            state.checkOutFlag = !state.checkOutFlag;
        }
    },
    // 现金结算
    cashCheckOut (state) {
        let checkOutList = [];
        let checkOutNumber = [];
        let total = 0;
        for (let i = state.shoppingCartList.length - 1; i >= 0; i--) {
            if (state.shoppingFlag[i] === true) {
                checkOutList.push(state.shoppingCartList[i]);
                checkOutNumber.push(state.shoppingNumber[i]);
                total += (state.shoppingCartList[i].price * state.shoppingNumber[i]);
                // 减掉结算的
                for (let j = 0; j < state.shoppingList.length; j++) {
                    if (state.shoppingList[j].coding === state.shoppingCartList[i].coding) {
                        state.shoppingList[j].number = state.shoppingList[j].number - state.shoppingNumber[i];
                    }
                }
                // 清除掉已经结算的商品
                state.shoppingCartList.splice(i, 1);
                state.shoppingFlag.splice(i, 1);
                state.shoppingNumber.splice(i, 1);
            }
        }
        // 生成收银记录
        let newDate = new Date();
        let year = newDate.getFullYear();
        let month = newDate.getMonth() + 1;
        let day = newDate.getDate();
        let hour = newDate.getHours();
        let minute = newDate.getMinutes();
        let date = year + '-' + month + '-' + day + ' ' + hour + ':' + minute; 

        let obj = new Object();
        obj.date = date;
        obj.total = total.toFixed(1);
        obj.shoppingList = checkOutList;
        obj.shoppingNumber = checkOutNumber;

        state.shoppingRecordList.unshift(obj);
        state.checkOutFlag = false;
    },

    // 商品操作部分
    // 更改商品名称
    changeShoppingName (state, obj) {
        let index = null;
        for (let i = 0; i < state.shoppingList.length; i++) {
            if (state.shoppingList[i].coding === obj.shopping.coding) {
                index = i;
            }
        }
        state.shoppingList[index].name = obj.message;
    },
    // 更改商品价格
    changeShoppingPrice (state, obj) {
        let index = null;
        for (let i = 0; i < state.shoppingList.length; i++) {
            if (state.shoppingList[i].coding === obj.shopping.coding) {
                index = i;
            }
        }
        state.shoppingList[index].price = obj.message;
    },
    // 更改商品数量
    changeShoppingNumber (state, obj) {
        let index = null;
        for (let i = 0; i < state.shoppingList.length; i++) {
            if (state.shoppingList[i].coding === obj.shopping.coding) {
                index = i;
            }
        }
        state.shoppingList[index].number = obj.message;
    },  
    // 删除商品
    deleteShopping (state, obj) {
        let index = null;
        for (let i = 0; i < state.shoppingList.length; i++) {
            if (state.shoppingList[i].coding === obj.shopping.coding) {
                index = i;
            }
        }
        state.shoppingList.splice(index, 1);
    },

    // 消息通知部分
    // 检查新消息列表
    checkNewMessageList (state) {
        if (state.newMessageList.length === 0) {
            state.newMessageNumberFlag = false;
        } else {
            state.newMessageNumberFlag = true;
        }
    },
    // 检查所有消息
    checkMessageList (state) {
        if (state.messageList.length === 0 && state.newMessageList.length === 0) {
            state.messageFlag = 'noMessage';
        } else {
            state.messageFlag = 'hasMessage';
        }
    },
    // 改变新消息通知显示
    changeNewMessageNumberFlag (state) {
        state.newMessageNumberFlag = false;
    },
    // 设置保质期检查期限
    setDate (state, day) {
        state.dateLimit = day;
    },
    // 设置库存检查数量
    setNumber (state, number) {
        state.numberLimit = number;
    },
    // 检查商品
    checkShopping (state) {
        state.messageList.splice(0, 0, ...state.newMessageList);
        state.newMessageList = [];
        let newDate = new Date().getTime();
        for (let i = 0; i < state.shoppingList.length; i++) {
            let date = new Date(state.shoppingList[i].date).getTime();
            let dayNumber = Math.floor((date - newDate) / 1000 / 60 / 60 / 24);
            // 检查保质期
            if (dayNumber <= state.dateLimit) {
                let obj = new Object();
                obj.name = 'date';
                obj.date = dayNumber;
                obj.shopping = state.shoppingList[i];
                let flag = true;
                for (let j = 0; j < state.messageList.length; j++) {
                    if (state.messageList[j].name === obj.name && state.messageList[j].shopping === obj.shopping && state.messageList[j].date === obj.date) {
                        flag = false;
                    }
                }
                if (flag) {
                    state.newMessageList.unshift(obj);
                }
            }
            // 检查库存
            if (state.shoppingList[i].number <= state.numberLimit) {
                let obj = new Object();
                obj.name = 'number';
                obj.shopping = state.shoppingList[i];
                let flag = true;
                for (let j = 0; j < state.messageList.length; j++) {
                    if (state.messageList[j].name === obj.name && state.messageList[j].shopping === obj.shopping) {
                        flag = false;
                    }
                }
                if (flag === true) {
                    state.newMessageList.unshift(obj);
                }
            }
        }
    },
}