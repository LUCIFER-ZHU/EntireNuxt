<!--
  客户管理页面
  文件路径: app/pages/customers/index.vue
  作用: 客户列表展示、搜索、筛选、增删改查
-->

<script setup lang="ts">
/**
 * 客户管理页面
 *
 * @description
 * 提供完整的客户管理功能：
 * - 客户列表展示（分页）
 * - 搜索和筛选
 * - 新增客户
 * - 编辑客户
 * - 删除客户
 */

import { ref, reactive, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import type { TableColumn } from '@nuxt/ui'
import {
  getCustomers,
  deleteCustomer,
  createCustomer,
  updateCustomer,
  type Customer,
  type CustomerListParams,
  type CreateCustomerRequest,
  customerLevelOptions,
  customerStatusOptions,
  getLevelLabel,
  getStatusLabel,
  getLevelColor,
  getStatusColor,
} from '~/api/customers'

// 表格列定义
const columns: TableColumn<Customer>[] = [
  { accessorKey: 'name', header: '姓名' },
  { accessorKey: 'contact', header: '联系方式' },
  { accessorKey: 'company', header: '公司' },
  { accessorKey: 'level', header: '等级' },
  { accessorKey: 'status', header: '状态' },
  { accessorKey: 'createdAt', header: '创建时间' },
  { accessorKey: 'actions', header: '操作' },
]

// ============================================================
// 1. 状态定义
// ============================================================

const toast = useToast()

// 加载状态
const loading = ref(false)
const submitting = ref(false)

// 客户列表数据
const customers = ref<Customer[]>([])
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
})

// 查询参数
const queryParams = reactive<CustomerListParams>({
  page: 1,
  pageSize: 10,
  keyword: '',
  level: undefined,
  status: undefined,
  sortBy: 'createdAt',
  sortOrder: 'desc',
})

// 模态框状态
const showModal = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const editingCustomer = ref<Customer | null>(null)

// 表单数据
const formData = reactive<CreateCustomerRequest>({
  name: '',
  email: null,
  phone: null,
  company: null,
  address: null,
  level: 'REGULAR',
  status: 'ACTIVE',
  source: null,
  industry: null,
  notes: null,
  assignedTo: null,
})

// 删除确认
const showDeleteConfirm = ref(false)
const deletingCustomer = ref<Customer | null>(null)

// ============================================================
// 2. 方法定义
// ============================================================

/**
 * 获取客户列表
 */
async function fetchCustomers() {
  loading.value = true
  try {
    const result = await getCustomers(queryParams)
    customers.value = result.customers
    Object.assign(pagination, result.pagination)
  } catch (error: any) {
    toast.error(error.message || '获取客户列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * 搜索处理
 */
function handleSearch() {
  queryParams.page = 1
  fetchCustomers()
}

/**
 * 重置筛选
 */
function handleReset() {
  queryParams.keyword = ''
  queryParams.level = undefined
  queryParams.status = undefined
  queryParams.page = 1
  fetchCustomers()
}

/**
 * 页码变化
 */
function handlePageChange(page: number) {
  queryParams.page = page
  fetchCustomers()
}

/**
 * 每页数量变化
 */
function handlePageSizeChange(pageSize: number | undefined) {
  if (!pageSize) return
  queryParams.pageSize = pageSize
  queryParams.page = 1
  fetchCustomers()
}

/**
 * 打开新增模态框
 */
function openCreateModal() {
  modalMode.value = 'create'
  editingCustomer.value = null
  resetForm()
  showModal.value = true
}

/**
 * 打开编辑模态框
 */
function openEditModal(customer: Customer) {
  modalMode.value = 'edit'
  editingCustomer.value = customer
  Object.assign(formData, {
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    company: customer.company,
    address: customer.address,
    level: customer.level,
    status: customer.status,
    source: customer.source,
    industry: customer.industry,
    notes: customer.notes,
    assignedTo: customer.assignedUser?.id || null,
  })
  showModal.value = true
}

/**
 * 重置表单
 */
function resetForm() {
  Object.assign(formData, {
    name: '',
    email: null,
    phone: null,
    company: null,
    address: null,
    level: 'REGULAR',
    status: 'ACTIVE',
    source: null,
    industry: null,
    notes: null,
    assignedTo: null,
  })
}

/**
 * 提交表单
 */
async function handleSubmit() {
  if (!formData.name.trim()) {
    toast.error('客户姓名不能为空')
    return
  }

  submitting.value = true
  try {
    if (modalMode.value === 'create') {
      await createCustomer(formData)
      toast.success('客户创建成功')
    } else {
      if (editingCustomer.value) {
        await updateCustomer(editingCustomer.value.id, formData)
        toast.success('客户更新成功')
      }
    }
    showModal.value = false
    fetchCustomers()
  } catch (error: any) {
    toast.error(error.message || '操作失败')
  } finally {
    submitting.value = false
  }
}

/**
 * 确认删除
 */
function confirmDelete(customer: Customer) {
  deletingCustomer.value = customer
  showDeleteConfirm.value = true
}

/**
 * 执行删除
 */
async function handleDelete() {
  if (!deletingCustomer.value) return

  submitting.value = true
  try {
    await deleteCustomer(deletingCustomer.value.id)
    toast.success('客户删除成功')
    showDeleteConfirm.value = false
    fetchCustomers()
  } catch (error: any) {
    toast.error(error.message || '删除失败')
  } finally {
    submitting.value = false
    deletingCustomer.value = null
  }
}

// ============================================================
// 3. 生命周期
// ============================================================

onMounted(() => {
  fetchCustomers()
})
</script>

<template>
  <div class="customers-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">客户管理</h1>
      <UButton color="primary" icon="i-heroicons-plus" @click="openCreateModal">
        新增客户
      </UButton>
    </div>

    <!-- 搜索和筛选 -->
    <UCard class="filter-card">
      <div class="filter-row">
        <UInput
          v-model="queryParams.keyword"
          placeholder="搜索姓名、邮箱、电话、公司"
          icon="i-heroicons-magnifying-glass"
          class="filter-input"
          @keyup.enter="handleSearch"
        />
        <USelect
          v-model="queryParams.level"
          :options="[{ label: '全部等级', value: '' }, ...customerLevelOptions]"
          placeholder="选择等级"
          class="filter-select"
        />
        <USelect
          v-model="queryParams.status"
          :options="[{ label: '全部状态', value: '' }, ...customerStatusOptions]"
          placeholder="选择状态"
          class="filter-select"
        />
        <UButton color="primary" @click="handleSearch">搜索</UButton>
        <UButton color="neutral" variant="soft" @click="handleReset">重置</UButton>
      </div>
    </UCard>

    <!-- 客户列表 -->
    <UCard>
      <UTable
        :rows="customers"
        :columns="columns"
        :loading="loading"
      >
        <!-- 联系方式列 -->
        <template #contact-cell="{ row }">
          <div class="contact-info">
            <div v-if="row.original.email" class="text-sm">{{ row.original.email }}</div>
            <div v-if="row.original.phone" class="text-sm text-gray-500">{{ row.original.phone }}</div>
          </div>
        </template>

        <!-- 等级列 -->
        <template #level-cell="{ row }">
          <UBadge :color="getLevelColor(row.original.level)" size="sm">
            {{ getLevelLabel(row.original.level) }}
          </UBadge>
        </template>

        <!-- 状态列 -->
        <template #status-cell="{ row }">
          <UBadge :color="getStatusColor(row.original.status)" size="sm" variant="soft">
            {{ getStatusLabel(row.original.status) }}
          </UBadge>
        </template>

        <!-- 创建时间列 -->
        <template #createdAt-cell="{ row }">
          {{ new Date(row.original.createdAt).toLocaleDateString('zh-CN') }}
        </template>

        <!-- 操作列 -->
        <template #actions-cell="{ row }">
          <div class="action-buttons">
            <UButton
              color="primary"
              variant="ghost"
              icon="i-heroicons-pencil-square"
              size="xs"
              @click="openEditModal(row.original)"
            >
              编辑
            </UButton>
            <UButton
              color="error"
              variant="ghost"
              icon="i-heroicons-trash"
              size="xs"
              @click="confirmDelete(row.original)"
            >
              删除
            </UButton>
          </div>
        </template>
      </UTable>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <UPagination
          v-model="pagination.page"
          :total="pagination.total"
          :page-count="pagination.pageSize"
          @update:model-value="handlePageChange"
        />
        <USelect
          v-model="pagination.pageSize"
          :options="[
            { label: '10条/页', value: 10 },
            { label: '20条/页', value: 20 },
            { label: '50条/页', value: 50 },
          ]"
          class="page-size-select"
          @update:model-value="(handlePageSizeChange as any)"
        />
      </div>
    </UCard>

    <!-- 新增/编辑模态框 -->
    <UModal v-model="showModal" :title="modalMode === 'create' ? '新增客户' : '编辑客户'">
      <UCard>
        <template #header>
          <h3 class="text-lg font-medium">
            {{ modalMode === 'create' ? '新增客户' : '编辑客户' }}
          </h3>
        </template>

        <form class="form-grid" @submit.prevent="handleSubmit">
          <UFormGroup label="客户姓名" required>
            <UInput v-model="formData.name" placeholder="请输入客户姓名" />
          </UFormGroup>

          <UFormGroup label="邮箱">
            <UInput v-model="formData.email" placeholder="请输入邮箱" type="email" />
          </UFormGroup>

          <UFormGroup label="电话">
            <UInput v-model="formData.phone" placeholder="请输入电话" />
          </UFormGroup>

          <UFormGroup label="公司名称">
            <UInput v-model="formData.company" placeholder="请输入公司名称" />
          </UFormGroup>

          <UFormGroup label="客户等级">
            <USelect
              v-model="formData.level"
              :options="customerLevelOptions"
              placeholder="选择等级"
            />
          </UFormGroup>

          <UFormGroup label="客户状态">
            <USelect
              v-model="formData.status"
              :options="customerStatusOptions"
              placeholder="选择状态"
            />
          </UFormGroup>

          <UFormGroup label="客户来源">
            <UInput v-model="formData.source" placeholder="如：网站、推荐、展会" />
          </UFormGroup>

          <UFormGroup label="所属行业">
            <UInput v-model="formData.industry" placeholder="请输入行业" />
          </UFormGroup>

          <UFormGroup label="详细地址" class="full-width">
            <UTextarea v-model="formData.address" placeholder="请输入详细地址" />
          </UFormGroup>

          <UFormGroup label="备注" class="full-width">
            <UTextarea v-model="formData.notes" placeholder="请输入备注信息" />
          </UFormGroup>
        </form>

        <template #footer>
          <div class="modal-footer">
            <UButton color="neutral" variant="soft" @click="showModal = false">
              取消
            </UButton>
            <UButton color="primary" :loading="submitting" @click="handleSubmit">
              {{ modalMode === 'create' ? '创建' : '保存' }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- 删除确认模态框 -->
    <UModal v-model="showDeleteConfirm" title="确认删除">
      <UCard>
        <template #header>
          <h3 class="text-lg font-medium text-red-600">确认删除</h3>
        </template>

        <p v-if="deletingCustomer">
          确定要删除客户 <strong>{{ deletingCustomer.name }}</strong> 吗？此操作不可恢复。
        </p>

        <template #footer>
          <div class="modal-footer">
            <UButton color="neutral" variant="soft" @click="showDeleteConfirm = false">
              取消
            </UButton>
            <UButton color="error" :loading="submitting" @click="handleDelete">
              确认删除
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<style scoped lang="scss">
.customers-page {
  padding: 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
}

.filter-card {
  margin-bottom: 1.5rem;
}

.filter-row {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.filter-input {
  flex: 1;
  min-width: 250px;
}

.filter-select {
  width: 150px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.page-size-select {
  width: 120px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.full-width {
  grid-column: span 2;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .full-width {
    grid-column: span 1;
  }

  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-input,
  .filter-select {
    width: 100%;
  }
}
</style>
