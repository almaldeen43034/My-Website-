
// ========== 1- إنشاء المتجر (لصفحة create.html) ==========
function createStore(e){
 e.preventDefault();
 let name = document.querySelector('input[name="store_name"]').value.trim();
 let link = document.querySelector('input[name="store_link"]').value.trim();
 let email = document.querySelector('input[name="email"]').value.trim();
 let pass = document.querySelector('input[name="password"]').value;
 let confirm = document.querySelector('input[name="confirm_password"]').value;
 let templateEl = document.querySelector('input[name="template"]:checked');
 let template = templateEl ? templateEl.value : "classic";

 if(pass !== confirm){
   alert("❌ كلمات المرور غير متطابقة");
   return;
 }
 if(link.length < 3){
   alert("❌ رابط المتجر قصير جداً");
   return;
 }

 let store = {
   storeName: name,
   storeLink: link,
   email: email,
   template: template,
   date: new Date().toLocaleDateString('ar-EG')
 };

 localStorage.setItem('myStore', JSON.stringify(store));
 // عشان نجهز قائمة المنتجات الخاصة بالمتجر دا
 if(!localStorage.getItem('products')){
   localStorage.setItem('products', JSON.stringify([]));
 }

 alert("🎉 مبروك! تم إنشاء متجر " + name);
 window.location.href = "dashboard.html";
}

// ========== 2- لوحة التحكم (لصفحة dashboard.html) ==========
let products = JSON.parse(localStorage.getItem('products')) || [];

function loadDashboard(){
 let s = JSON.parse(localStorage.getItem('myStore'));
 if(s && document.getElementById('welcome')){
   document.getElementById('welcome').textContent = "مرحباً صاحب " + s.storeName + " | القالب: " + s.template;
 }
 displayProducts();
}

function addProduct(e){
 e.preventDefault();
 let nameInput = document.getElementById('pName');
 let priceInput = document.getElementById('pPrice');
 let qtyInput = document.getElementById('pQty');

 let name = nameInput.value.trim();
 let price = priceInput.value.trim();
 let qty = qtyInput.value.trim();

 if(!name || !price || !qty){
   alert("املأ كل الحقول");
   return;
 }

 let obj = {
   id: Date.now(),
   name: name,
   price: price,
   qty: qty
 };

 products.push(obj);
 localStorage.setItem('products', JSON.stringify(products));

 // تفريغ الحقول
 e.target.reset();
 
 displayProducts();
 console.log("تم الحفظ:", obj);
}

function displayProducts(){
 let tb = document.getElementById('productsTable');
 let total = document.getElementById('totalProducts');
 if(!tb) return;

 if(products.length === 0){
   tb.innerHTML = `<tr><td colspan="4" style="text-align:center">لا يوجد منتجات بعد</td></tr>`;
   if(total) total.textContent = "0 منتج";
   return;
 }

 tb.innerHTML = "";
 products.forEach(p => {
   tb.innerHTML += `<tr>
     <td>${p.name}</td>
     <td>${p.price} جنيه</td>
     <td>${p.qty}</td>
     <td><button onclick="deleteProduct(${p.id})">حذف</button></td>
   </tr>`;
 });

 if(total) total.textContent = products.length + " منتج";
}

function deleteProduct(id){
 products = products.filter(p => p.id !== id);
 localStorage.setItem('products', JSON.stringify(products));
 displayProducts();
}

function logout(){
 localStorage.clear();
 window.location.href = "index.html";
}

// تشغيل تلقائي عند فتح الداشبورد
document.addEventListener('DOMContentLoaded', ()=>{
 if(window.location.pathname.includes('dashboard.html') || window.location.href.includes('dashboard.html')){
   loadDashboard();
 }
});