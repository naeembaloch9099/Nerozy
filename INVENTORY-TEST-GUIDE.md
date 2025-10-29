# 🧪 Inventory Management Testing Guide

## Overview

This guide will help you test the complete inventory management system across all parts of your application.

---

## ✅ Pre-Test Setup

### 1. Check Initial Product Stock

1. Go to Admin Dashboard → Products
2. Find a product (e.g., "Men's Kurta")
3. **Note the current stock quantity** (e.g., Stock: 50)

---

## 🧪 Test Scenarios

### Test 1: Order Places Stock Deduction

#### Steps:

1. **Frontend (Customer View)**

   - Go to homepage: http://localhost:5173/
   - Click on a product
   - Check current stock badge on product details page
   - Add 2 items to cart
   - Go to cart
   - Proceed to checkout
   - Fill in shipping details
   - Complete order (use Stripe test card: `4242 4242 4242 4242`)

2. **Verify Stock Deduction**

   - **Check Backend Console/Logs:**

     ```
     ✅ Order created: ORD-123456
     📦 Stock updated for Men's Kurta: -2 (remaining: 48)
     ```

   - **Check Admin Dashboard:**

     - Go to Admin → Products
     - Find the same product
     - **Stock should be reduced by 2** (50 → 48)

   - **Check Frontend:**
     - Go back to homepage
     - Product card should show updated stock (48 available)
     - Product details page should show updated stock

3. **Verify Order Created:**
   - Go to Admin → Orders
   - Find your order
   - Status should be "confirmed" (Stripe) or "pending" (direct)

---

### Test 2: Multiple Orders Sequential

#### Steps:

1. Place Order 1: Buy 3 items
   - Initial stock: 48
   - After order: 45
2. Place Order 2: Buy 5 items

   - Initial stock: 45
   - After order: 40

3. **Verify:**
   - Total deduction: 8 items
   - Final stock: 40
   - Both orders visible in Admin → Orders

---

### Test 3: Out of Stock Prevention

#### Steps:

1. Find current stock (e.g., 40)
2. Try to order MORE than available (e.g., 50 items)
3. **Expected Result:**
   ```
   ❌ Error: Insufficient stock
   Details: "Men's Kurta - Only 40 available, requested 50"
   ```
4. Order should NOT be created
5. Stock should NOT change

---

### Test 4: Order Cancellation Restores Stock

#### Steps:

1. Note current stock (e.g., 40)
2. Place an order for 5 items
3. Stock reduces to 35
4. **Admin Dashboard:**
   - Go to Orders
   - Find the order
   - Change status to "Canceled"
5. **Verify Stock Restored:**
   - Check backend console:
     ```
     ♻️ Restoring stock for canceled order ORD-123456
     ♻️ Stock restored: Men's Kurta +5 (new total: 40)
     ✅ Stock restored for 1 products
     ```
   - Admin → Products shows stock back to 40
   - Frontend homepage shows stock: 40

---

### Test 5: Low Stock Warnings

#### Steps:

1. Reduce product stock to 10 (edit in admin)
2. Place order for 7 items
3. **Check Backend Console:**
   ```
   📦 Stock updated: -7 (remaining: 3)
   ⚠️ Low stock after order: [Product with 3 remaining]
   ```
4. Product should show "Low Stock" badge on frontend

---

### Test 6: Real-Time Updates Across All Pages

#### Setup:

- Open 3 browser tabs:
  - Tab 1: Homepage (product list)
  - Tab 2: Product details page
  - Tab 3: Admin products page

#### Steps:

1. Note stock on all tabs (e.g., 40)
2. In a 4th tab, complete an order for 5 items
3. After order completes, **refresh each tab**
4. **All tabs should show updated stock: 35**

---

## 🔍 What to Check in Each Part

### Frontend (Customer Side)

- ✅ Product cards show correct stock
- ✅ Product details show correct stock
- ✅ Stock badges (In Stock / Low Stock / Out of Stock)
- ✅ Can't add more to cart than available
- ✅ Out of stock products are disabled
- ✅ Stock updates after order completion

### Admin Dashboard

- ✅ Products table shows updated quantities
- ✅ Orders table shows all orders
- ✅ Order status changes work
- ✅ Canceling order restores stock

### Backend (Console Logs)

- ✅ "📦 Stock updated" messages
- ✅ "⚠️ Low stock" warnings
- ✅ "♻️ Stock restored" on cancellation
- ✅ "❌ Failed to update" errors (if any)

---

## 📊 Expected Console Output Examples

### Successful Order:

```
Creating new order with data: {...}
Stock check passed for all items
✅ Order created: ORD-891234
📦 Stock updated for Men's Kurta: -2 (remaining: 48)
📧 Order confirmation email sent to: customer@example.com
```

### Low Stock Warning:

```
📦 Stock updated for Women's Dress: -8 (remaining: 3)
⚠️ Low stock after order: [
  {
    productId: "...",
    productName: "Women's Dress",
    remaining: 3,
    isLowStock: true
  }
]
```

### Order Cancellation:

```
♻️ Restoring stock for canceled order ORD-891234
♻️ Stock restored: Men's Kurta +2 (new total: 50)
♻️ Stock restored: Women's Dress +1 (new total: 16)
✅ Stock restored for 2 products
📧 Status update email sent: confirmed → canceled
```

### Insufficient Stock:

```
Stock check failed:
{
  success: false,
  errors: [
    {
      productName: "Men's Kurta",
      message: "Insufficient stock: Only 10 available, requested 50"
    }
  ]
}
Order creation aborted
```

---

## 🎯 Quick Test Checklist

Use this checklist for rapid testing:

- [ ] Place order → Stock reduces ✓
- [ ] Check admin products → Updated quantity ✓
- [ ] Check admin orders → Order appears ✓
- [ ] Frontend homepage → Shows new stock ✓
- [ ] Product details page → Shows new stock ✓
- [ ] Try to order more than available → Error shown ✓
- [ ] Cancel order in admin → Stock restored ✓
- [ ] Check console logs → Correct messages ✓
- [ ] Low stock (< 5) → Warning logged ✓
- [ ] Multiple orders → All stock changes correct ✓

---

## 🐛 Troubleshooting

### Stock Not Updating?

1. Check backend console for errors
2. Verify product has valid MongoDB `_id` in order items
3. Check Railway logs if deployed
4. Ensure order creation completed successfully

### Stock Restored Twice?

- Check if you're refreshing the page after canceling
- Order status should only change once

### Frontend Not Showing Updates?

1. Hard refresh the page (Ctrl+Shift+R)
2. Check browser console for errors
3. Verify API calls are completing successfully

---

## 🚀 Testing on Production

### On Vercel (Frontend):

1. Visit: https://nerozy.vercel.app
2. Follow same test steps
3. Check Railway backend logs for confirmations

### On Railway (Backend):

1. View logs at: https://railway.app/project/[your-project]
2. Filter for "Stock updated" messages
3. Monitor real-time during testing

---

## ✅ Success Criteria

Your inventory management system is working correctly if:

1. ✅ Orders deduct stock automatically
2. ✅ Cancellations restore stock automatically
3. ✅ Out of stock orders are prevented
4. ✅ Low stock warnings appear (< 5 items)
5. ✅ All product displays show current stock
6. ✅ Console logs show detailed inventory changes
7. ✅ Admin dashboard reflects real-time changes
8. ✅ Multiple concurrent orders handle correctly
9. ✅ Email notifications include order details
10. ✅ No negative stock quantities possible

---

## 📝 Test Results Template

Copy and fill this out:

```
Date: ___________
Tester: ___________

Test 1 - Order Deduction: ⬜ Pass ⬜ Fail
  Initial Stock: ____
  Order Quantity: ____
  Final Stock: ____
  Expected: ____
  Notes: ___________

Test 2 - Multiple Orders: ⬜ Pass ⬜ Fail
  Notes: ___________

Test 3 - Out of Stock: ⬜ Pass ⬜ Fail
  Notes: ___________

Test 4 - Cancellation Restore: ⬜ Pass ⬜ Fail
  Notes: ___________

Test 5 - Low Stock Warning: ⬜ Pass ⬜ Fail
  Notes: ___________

Test 6 - Real-Time Updates: ⬜ Pass ⬜ Fail
  Notes: ___________

Overall Result: ⬜ All Pass ⬜ Some Failures
```

---

## 🎉 Next Steps After Successful Testing

If all tests pass:

1. ✅ System is production-ready
2. Consider adding:
   - Email alerts for low stock to admin
   - Inventory reports in analytics
   - Automatic restock notifications
   - Stock history tracking

Happy Testing! 🚀
