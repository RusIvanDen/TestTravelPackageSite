import { defineStore } from 'pinia'
import { ref, computed, watch, onMounted } from 'vue'
import axios from 'axios'

const API_BASE = 'http://localhost:3000'

export const useCartStore = defineStore('cart', () => {
    const orderId = ref<string | null>(null)
    const items = ref<{ itemId: string; count: number }[]>([])

    onMounted(async () => {
        try {
            const res = await axios.get(`${API_BASE}/orders`)
            if (res.data.length > 0) {
                orderId.value = res.data[0].id
                items.value = res.data[0].content
            } else {
                const createRes = await axios.post(`${API_BASE}/orders`, {
                    content: []
                })
                orderId.value = createRes.data.id
                items.value = []
            }
        } catch (error) {
            console.error('Ошибка загрузки заказа:', error)
        }
    })

    watch(
        items,
        async (newItems) => {
            if (!orderId.value) return
            try {
                await axios.patch(`${API_BASE}/orders/${orderId.value}`, {
                    content: newItems
                })
            } catch (error) {
                console.error('Ошибка синхронизации заказа:', error)
            }
        },
        { deep: true }
    )

    function add(itemId: string) {
        const existing = items.value.find(i => i.itemId === itemId)
        if (existing) existing.count++
        else items.value.push({ itemId, count: 1 })
    }

    function remove(itemId: string) {
        const idx = items.value.findIndex(i => i.itemId === itemId)
        if (idx !== -1) items.value.splice(idx, 1)
    }

    function toggle(itemId: string) {
        isInCart(itemId) ? remove(itemId) : add(itemId)
    }

    function isInCart(itemId: string) {
        return items.value.some(i => i.itemId === itemId)
    }

    const totalCount = computed(() =>
        items.value.reduce((sum, i) => sum + i.count, 0)
    )

    return { items, add, remove, toggle, isInCart, totalCount }
})
