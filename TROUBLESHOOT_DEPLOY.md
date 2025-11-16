# 🔧 TROUBLESHOOTING DEPLOYMENT

## ❌ PROBLEMA: Site not found / Can't connect

### **POSIBLES CAUSAS:**

1. **Build falló** - Revisa logs en DigitalOcean
2. **Variables de entorno faltantes**
3. **Configuración incorrecta**
4. **DNS no propagado**

### **SOLUCIONES RÁPIDAS:**

#### 1. **Verificar en DigitalOcean Console:**
- Ve a Apps > tu-app
- Revisa "Activity" tab
- Busca errores en build logs

#### 2. **Verificar Variables de Entorno:**
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

#### 3. **Rebuild Manual:**
- En DigitalOcean: Actions > Force Rebuild
- Espera 3-5 minutos

#### 4. **Configuración Alternativa Simple:**

Usa esta configuración mínima en `.do/app.yaml`:

```yaml
name: ayllu-unmsm
static_sites:
- name: web
  build_command: npm run build
  output_dir: dist
  index_document: index.html
  error_document: index.html
```

#### 5. **Test Local:**
```bash
npm run build
npm run preview
```
Debe funcionar en http://localhost:4173

### **PLAN B: NETLIFY (MÁS SIMPLE)**

Si DigitalOcean sigue fallando:

1. **Crear cuenta Netlify**
2. **Conectar GitHub repo**
3. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **Variables de entorno:** Agregar las mismas
5. **Deploy automático**

### **PLAN C: VERCEL (ULTRA SIMPLE)**

```bash
npm install -g vercel
vercel --prod
```

### **DEBUGGING CHECKLIST:**

- [ ] Build local funciona (`npm run build`)
- [ ] Variables de entorno configuradas
- [ ] Repo GitHub actualizado
- [ ] Logs de DigitalOcean revisados
- [ ] DNS cache limpiado (Ctrl+F5)

### **CONTACTO SOPORTE:**

Si nada funciona:
- DigitalOcean Support Chat
- O migrar a Netlify/Vercel (5 minutos)