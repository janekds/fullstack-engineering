# Disable Supabase Default Emails

To use our beautiful custom branded emails instead of Supabase's plain default ones, you need to disable Supabase's built-in email confirmations.

## 📧 **Step 1: Disable Email Confirmations in Supabase Dashboard**

1. **Go to your Supabase project**: https://supabase.com/dashboard/project/hdbkdtrzztsffilqjfvx
2. **Navigate to**: Authentication → Settings
3. **Scroll down to**: "Email Confirmations"
4. **Turn OFF**: "Enable email confirmations"
5. **Save changes**

## 🎨 **What You Get Instead:**

### **Before (Supabase Default):**
- ❌ Plain, unbranded email
- ❌ Basic Supabase styling  
- ❌ Generic confirmation page
- ❌ No brand identity

### **After (Custom Durdle Emails):**
- ✅ Beautiful gradient header with Durdle branding
- ✅ Professional email design with emojis and colors
- ✅ Step-by-step onboarding preview
- ✅ Custom confirmation page matching your brand
- ✅ Mobile-responsive design
- ✅ Backup confirmation link included

## 🚀 **How It Works Now:**

1. **User signs up** → Supabase creates account (no email sent by Supabase)
2. **Our app sends** → Beautiful branded confirmation email via Resend
3. **User clicks link** → Goes to our custom `/auth/confirm` page
4. **Email confirmed** → Redirects to onboarding with success message

## 🔧 **Alternative: Keep Supabase Emails Enabled**

If you prefer to keep both (for redundancy), the app will work fine. Users might receive:
1. Supabase's plain confirmation email
2. Our beautiful Durdle branded email  

Both will work for confirmation, but the Durdle one provides a much better user experience.

## 🎯 **Recommended Setup:**

**For the best user experience, disable Supabase emails** and use only our custom branded emails. This gives you:
- Complete control over email design
- Consistent branding
- Better user experience
- Professional appearance
- Custom confirmation flow

---

**Pro Tip**: You can always customize the email templates further in `/src/lib/resend.ts` to match your exact brand guidelines! 🎨
