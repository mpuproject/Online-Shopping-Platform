<script setup>
import { ref } from 'vue'

const showChangeDialog = ref(false)
const showAddDialog = ref(false)

// 新增地址对象
const newAddress = ref({
  recipient: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  additional_addr: '',
})

const emit = defineEmits(['change-address', 'add-address'])

// 切换地址
const activeAddress = ref({})
const switchAddress = (addr) => {
  activeAddress.value = addr
}

// 确认地址切换
const confirmChange = () => {
  emit('change-address', activeAddress.value)
  showChangeDialog.value = false
  activeAddress.value = {}
}

// 添加地址
const handleAddAddress = () => {
  emit('add-address', newAddress.value)
  showAddDialog.value = false
  // 重置表单
  newAddress.value = {
    recipient: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    additional_addr: '',
  }
}

defineExpose({
  showChangeDialog,
  showAddDialog
})
</script>


<template>
  <!-- 切换地址 -->
  <el-dialog v-model="showChangeDialog" title="Change Shipping Address" width="30%" center>
    <div class="addressWrapper">
      <div class="text item"
           :class="{active: activeAddress.id === addr.id}"
           @click="switchAddress(addr)"
           v-for="addr in addresses"
           :key="addr.id">
        <ul>
          <li><span>Recipient: </span>{{ addr.recipient }} </li>
          <li><span>Contact: </span>{{ addr.phone }}</li>
          <li><span>Address: </span>{{ addr.additional_addr + addr.fullLocation }}</li>
        </ul>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showChangeDialog = false">Cancel</el-button>
        <el-button type="primary" @click="confirmChange">Confirm</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 添加地址 -->
  <el-dialog v-model="showAddDialog" title="Add New Address" width="50%" center>
    <el-form :model="newAddress" label-width="120px" class="address-form">
      <el-form-item label="Recipient">
        <el-input v-model="newAddress.recipient" />
      </el-form-item>
      <el-form-item label="Contact">
        <el-input v-model="newAddress.phone" />
      </el-form-item>
      <el-form-item label="Province">
        <el-input v-model="newAddress.province" />
      </el-form-item>
      <el-form-item label="City">
        <el-input v-model="newAddress.city" />
      </el-form-item>
      <el-form-item label="District">
        <el-input v-model="newAddress.district" />
      </el-form-item>
      <el-form-item label="Detail Address">
        <el-input v-model="newAddress.additional_addr" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showAddDialog = false">Cancel</el-button>
        <el-button type="primary" @click="handleAddAddress">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
@use "sass:color";

.addressWrapper {
  max-height: 500px;
  overflow-y: auto;
}

.text {
  flex: 1;
  min-height: 90px;
  display: flex;
  align-items: center;

  &.item {
    border: 1px solid #f5f5f5;
    margin-bottom: 10px;
    cursor: pointer;

    &.active,
    &:hover {
      border-color: $xtxColor;
      background: color.scale($xtxColor, $lightness: 89.4736842105%);
    }

    >ul {
      padding: 10px;
      font-size: 14px;
      line-height: 30px;
    }
  }
}

.address-form {
  .el-form-item {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    margin-top: 10px;
    margin-bottom: 20px;

    .el-input {
      width: 100%;
    }
  }
}
</style>
