# 🔧 Backend Server Troubleshooting Guide

## ⚠️ Current Issue

The backend server is failing to start. The error is silent (no output), which suggests one of these issues:

1. **Import/Module Error** - One of the imports is failing
2. **Database Connection Error** - Can't connect to PostgreSQL
3. **Environment Variables Missing** - `.env` file issues
4. **Port Already in Use** - Port 5000 is occupied

---

## 🛠️ **Step-by-Step Debugging**

### **Step 1: Check if Port 5000 is in Use**

**Windows PowerShell**:
```powershell
cd e:\projects\sihSaksham\haathi\backend
netstat -ano | findstr :5000
```

If you see output, kill the process:
```powershell
taskkill /PID <PID_NUMBER> /F
```

---

### **Step 2: Verify Environment Variables**

Check if `.env` file exists in `backend/` folder:

**Required variables**:
```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
JWT_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
NODE_ENV=development
```

**Create `.env` if missing**:
```bash
cd backend
echo PORT=5000 > .env
echo DATABASE_URL=your_database_url_here >> .env
echo JWT_SECRET=your_secret_here >> .env
echo JWT_REFRESH_SECRET=your_refresh_secret_here >> .env
```

---

### **Step 3: Check Database Connection**

**Test PostgreSQL connection**:
```powershell
cd backend
node -e "import('pg').then(({default: {Pool}}) => { const pool = new Pool({connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/haathi'}); pool.query('SELECT NOW()').then(r => console.log('DB OK:', r.rows[0])).catch(e => console.error('DB Error:', e.message)); })"
```

---

### **Step 4: Test Individual Imports**

Run the test script I created:
```powershell
cd backend
node test-imports.js
```

This will show which import is failing.

---

### **Step 5: Check for Syntax Errors**

**Validate server.js**:
```powershell
cd backend
node --check server.js
```

**Validate user controller**:
```powershell
node --check src/controllers/userController.js
```

**Validate user routes**:
```powershell
node --check src/routes/users.js
```

---

### **Step 6: Run with Verbose Logging**

```powershell
cd backend
$env:DEBUG='*'
node server.js
```

Or:
```powershell
cd backend
node --trace-warnings --trace-deprecation server.js
```

---

## 🚀 **Manual Start Instructions**

### **Option 1: Using npm (Recommended)**

```powershell
cd e:\projects\sihSaksham\haathi\backend
npm run dev
```

### **Option 2: Using nodemon directly**

```powershell
cd e:\projects\sihSaksham\haathi\backend
npx nodemon server.js
```

### **Option 3: Using node directly**

```powershell
cd e:\projects\sihSaksham\haathi\backend
node server.js
```

---

## 📋 **Quick Checklist**

Before starting the server, ensure:

- [ ] PostgreSQL is running
- [ ] `.env` file exists with all required variables
- [ ] Port 5000 is not in use
- [ ] `node_modules` is installed (`npm install`)
- [ ] Database exists and is accessible
- [ ] All controller files exist:
  - `src/controllers/authController.js`
  - `src/controllers/userController.js`
  - `src/controllers/deviceController.js`
  - `src/controllers/hotspotController.js`
  - `src/controllers/notificationController.js`
  - `src/controllers/eventController.js`
- [ ] All route files exist:
  - `src/routes/auth.js`
  - `src/routes/users.js`
  - `src/routes/devices.js`
  - `src/routes/hotspots.js`
  - `src/routes/notifications.js`
  - `src/routes/eventRoutes.js`

---

## 🔍 **Common Errors & Solutions**

### **Error: "Cannot find module"**

**Solution**:
```powershell
cd backend
npm install
```

### **Error: "Port 5000 is already in use"**

**Solution**:
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or change port in .env
echo PORT=5001 > .env
```

### **Error: "Database connection failed"**

**Solution**:
1. Start PostgreSQL service
2. Verify DATABASE_URL in `.env`
3. Test connection:
```powershell
psql -U your_username -d your_database
```

### **Error: "JWT_SECRET is not defined"**

**Solution**:
Add to `.env`:
```env
JWT_SECRET=your_very_secret_key_minimum_32_characters_long
JWT_REFRESH_SECRET=your_refresh_secret_key_also_32_chars
```

---

## 🎯 **Expected Output When Server Starts**

```
[nodemon] 3.1.11
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node server.js`
Server + WebSockets running on http://localhost:5000
```

---

## 📝 **Files Created/Modified**

### **New Files**:
1. `backend/src/controllers/userController.js` - User management logic
2. `backend/src/routes/users.js` - User API routes
3. `backend/test-imports.js` - Debug script

### **Modified Files**:
1. `backend/server.js` - Added user routes
2. `frontend/src/pages/AdminDashboard.jsx` - Integrated APIs & search

---

## 🆘 **If Nothing Works**

### **Nuclear Option - Fresh Start**:

```powershell
# 1. Stop all node processes
taskkill /F /IM node.exe

# 2. Delete node_modules
cd e:\projects\sihSaksham\haathi\backend
Remove-Item -Recurse -Force node_modules

# 3. Clear npm cache
npm cache clean --force

# 4. Reinstall dependencies
npm install

# 5. Try starting again
npm run dev
```

---

## 📞 **Next Steps**

1. **Open a new PowerShell terminal**
2. **Navigate to backend folder**:
   ```powershell
   cd e:\projects\sihSaksham\haathi\backend
   ```
3. **Run the server**:
   ```powershell
   npm run dev
   ```
4. **Watch for errors** in the console
5. **If you see errors**, copy them and I can help fix them

---

## ✅ **Success Indicators**

When the server starts successfully, you should see:
- ✅ "Server + WebSockets running on http://localhost:5000"
- ✅ No error messages
- ✅ Frontend can connect (no "ERR_CONNECTION_REFUSED")
- ✅ API endpoints respond (test: http://localhost:5000/health)

---

## 🔗 **Test Endpoints After Server Starts**

Open browser and test:
- http://localhost:5000/ → Should show: `{"message":"Backend is running"}`
- http://localhost:5000/health → Should show database status

---

**Good luck! The server should start successfully after following these steps.** 🚀
