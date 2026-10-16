const loadCategories = () => {
    fetch('https://fakestoreapi.com/products/categories')
    .then(res => res.json())
    .then(data => showCategories(data))
    .catch(err => console.log(err))

    
}
const loadProducts = () => {
    fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(data => displayProducts(data),1000)
    .catch(err => console.log(err))
    
}
const loadCategoryProducts = (category) => {
    showSpinner()
   fetch(`https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`)
    .then(res => res.json())
    .then(data => {
         setTimeout(() => displayProducts(data), 1500) 
    })
    .catch(err => console.log(err))
    
}
let currentProducts = []

const showSpinner = () => {
    const productCont = document.getElementById('products')
    productCont.innerHTML = `
     <div class="col-span-full flex justify-center items-center py-20">
      <span class="loading loading-bars loading-lg"></span>
    </div>
    `
}
const showCategories = (categories) => {
    const categoriesCont = document.getElementById('categories')
    categories.forEach(category => {
        const div =  document.createElement('div')
        div.innerHTML = `
            <button data-category="${category}" class="btn btn-lg items-center w-full rounded-lg border py-7">${category} </button>
        `
       div.querySelector('button').addEventListener('click', (e) => {
      document.querySelectorAll('#categories button').forEach(b => {
        b.classList.remove('bg-slate-800', 'text-white')
      })
      e.currentTarget.classList.add('bg-slate-800', 'text-white')
      loadCategoryProducts(e.currentTarget.dataset.category)
    })
      categoriesCont.appendChild(div)
    });
}
const displayProducts = (products) => {
    currentProducts = products
    const productsCont = document.getElementById('products')
    productsCont.innerHTML = ''
    products.forEach(product => {
        console.log(product);
        const card = document.createElement('div')
        card.classList = 'bg-base-100 border rounded-xl border-gray-300'
        card.innerHTML = `
         <figure class="">
    <img class="object-contain w-40 h-48 mx-auto pt-4"
      src=${product.image}
  </figure>
  <div class="card-body">
    <h1 class="text-lg font-semibold line-clamp-1">${product.title}</h1>
    <span class="text-gray-500 font-medium">${product.category}</span>
    <div>
    <span><i class="fa-solid fa-star text-amber-400 mr-2"></i><span class="text-red-500 font-medium mr-4">${[product.rating.rate]}</span><span class="text-gray-500 font-medium">(${product.rating.count})</span></span>
    </div>
    <h2 class="text-lg font-semibold">$${product.price}</h2>
    <div class="flex gap-2 w-full">
      <btn onclick="addToFavorites('${product.image}')" class=" btn rounded-xl bg-white text-gray-700 border border-gray-300"><i class="fa-regular fa-heart heart"></i></btn>
      <btn class="btn flex-1 rounded-xl border border-gray-300  bg-white">Details</btn>
      <btn class="btn flex-1 rounded-xl bg-black text-white hover:opacity-80">Buy</btn>
    </div>
  </div>
        `
        productsCont.appendChild(card)
    });
    
}
document.getElementById('sort-btn').addEventListener('click' , () => {
    showSpinner()
    const sorted = [...currentProducts].sort((a,b) => b.price - a.price)
    setTimeout(() => displayProducts(sorted),1880)
})
loadCategories()
loadProducts()

const addToFavorites = (image) => {
    const favorites = document.getElementById('favorites')
    
    const item = document.createElement('div')
    item.classList = 'w-20 h-20 border border-gray-300 rounded-lg p-1 flex items-center justify-center bg-white '
    item.innerHTML =
    `
    <img  class=" object-contain w-full h-full" src="${image}"/>
    `
  
    favorites.appendChild(item)
    
}
