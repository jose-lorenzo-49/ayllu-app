# 🔐 CONFIGURAR AUTENTICACIÓN SUPABASE

## 📧 DESHABILITAR VERIFICACIÓN EMAIL (Para desarrollo)

### **Pasos en Supabase Dashboard:**

1. **Ve a Authentication → Settings**
2. **En "User Signups" sección:**
   - ✅ Enable email confirmations: **OFF**
   - ✅ Enable phone confirmations: **OFF**
3. **Save changes**

### **O ejecutar SQL directo:**

```sql
-- Deshabilitar verificación email
UPDATE auth.config 
SET email_confirm_required = false;
```

## 🚀 ALTERNATIVA: AUTH SIMPLIFICADO

Si sigues teniendo problemas, usa auth básico sin Supabase Auth:

```javascript
// En handleLogin - versión simplificada
const handleLogin = async () => {
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('email', formData.email)
    .single();
  
  if (data) {
    setCurrentUser(data);
    setPantalla('app');
  }
};
```

## ⚡ CONFIGURACIÓN RECOMENDADA DESARROLLO:

- ✅ Email confirmations: **OFF**
- ✅ Phone confirmations: **OFF** 
- ✅ Enable signup: **ON**
- ✅ RLS: **DISABLED** (ya hecho)

Esto permite registro/login inmediato sin verificaciones.