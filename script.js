const loadCategories = () => {
    fetch('https://fakestoreapi.com/products/categories')
    .then(res => res.json())
    .then(data => showCategories(data))
    .catch(err => console.log(err))

    
}
const loadProducts = () => {
    fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(data => {
        currentProducts = data
        displayProducts(data)
    })
    .catch(err => console.log(err))
    
}
const loadCategoryProducts = (category) => {
    showSpinner()
   fetch(`https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`)
    .then(res => res.json())
    .then(data => {
        currentProducts = data
         setTimeout(() => displayProducts(data), 1500) 
    })
    .catch(err => console.log(err))
    
}
const loadDetails = (id) => {
    fetch(`https://fakestoreapi.com/products/${id}`)
    .then(res => res.json())
    .then(data => displayDetails(data))
    .catch(err => console.log(err))
}
let currentProducts = []
const displayDetails = (product) => {
    const detailContainer = document.getElementById('modal-content')

    detailContainer.innerHTML =`
     <img src="${product.image}" alt="${product.title}" class="w-full h-64 object-contain" />
    <h2 class="text-2xl font-bold mt-4">${product.title}</h2>
    <p class="text-sm text-gray-500 mt-2">${product.category}</p>
    <p class="text-3xl font-bold mt-4">$${product.price}</p>
    <p class="text-sm text-gray-600 mt-4">${product.description}</p>
    <p class="text-center text-gray-400 mt-6 pt-4 border-t border-gray-100">
  A product of <span class="font-semibold text-gray-600">ShopEase</span>
</p>
    `

    document.getElementById('my_modal_5').showModal()
}
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
    const allCategories = [...categories, 'groceries']
    allCategories.forEach(category => {
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
    const productsCont = document.getElementById('products')
    productsCont.innerHTML = ''
    if(products.length === 0){
        productsCont.innerHTML =
        `
        <div class="col-span-full flex flex-col items-center justify-center py-20 text-center">
        <i class="fa-solid fa-magnifying-glass text-4xl text-gray-300 mb-4"></i>
        <h3 class="text-lg font-semibold text-gray-700">No products found</h3>
        <p class="text-sm text-gray-500 mt-1">Try a different search or category.</p>
      </div>
        `
        return
    }
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
    <h1 class="text-lg font-semibold line-clamp-1 ">${product.title}</h1>
    <span class="text-gray-500 font-medium tracking-wide">${product.category}</span>
    <div>
    <span><i class="fa-solid fa-star text-amber-400 mr-2"></i><span class="text-red-500 font-medium mr-4">${[product.rating.rate]}</span><span class="text-gray-500 font-medium">(${product.rating.count})</span></span>
    </div>
    <h2 class="text-lg font-semibold">$${product.price}</h2>
    <div class="flex gap-2 w-full">
      <button id="heart-btn" onclick="addToFavorites('${product.image}', this)" class="tracking-wider  hover:bg-gray-50 active:scale-90  btn transition-all duration-260 rounded-lg bg-white text-gray-700 border border-gray-200"><i class="fa-regular fa-heart heart"></i></button>
      <button onclick="loadDetails(${product.id})" class="active:scale-97  transition-all duration-200 btn flex-1 rounded-lg border border-gray-200 tracking-wider bg-white">Details</button>
      <button onclick="showBought(this)" class="btn active:scale-97 border-none  transition-all duration-200  tracking-wide  flex-1 rounded-lg bg-slate-900 text-white hover:opacity-80">Buy</button>
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

document.getElementById('search-input').addEventListener('keyup', (e) => {
  const query = e.target.value.toLowerCase()

  const filtered = currentProducts.filter(p =>
    p.title.toLowerCase().includes(query)
  )

  displayProducts(filtered)
})

const showBought = event => {
    let count = 3
    const countCont = document.getElementById('countdown-cont')
    countCont.innerText = count
    buyModal.showModal()
    const interval = setInterval(() => {
        count--
       if(count !== 0) countCont.innerText = count
        if(count < 1){
            clearInterval(interval)
            buyModal.close()
            event.innerText = 'Bought'
            event.disabled = true
            event.classList.add('opacity-60')
        }
    }, 1000)
}








loadCategories()
loadProducts()

const addToFavorites = (image, btn) => {
    const icon = btn.querySelector('.heart')
    icon.classList.remove('fa-regular') 
    icon.classList.add('fa-solid') 
    
       
    const favorites = document.getElementById('favorites')
    
    const item = document.createElement('div')
    item.classList = 'w-20 h-20 border border-gray-300 rounded-lg p-1 flex items-center justify-center bg-white '
    item.innerHTML =
    `
    <img  class=" object-contain w-full h-full" src="${image}"/>
    `
  
    favorites.appendChild(item)
    
}
document.getElementById('clear-btn').addEventListener('click', () => {
    document.getElementById('favorites').innerHTML = ''

     const allHeartButtons = document.querySelectorAll('#heart-btn')
  
     
   allHeartButtons.forEach(btn => {
    const icon = btn.querySelector('.heart')
    
    
      icon.classList.remove('fa-solid')
      icon.classList.add('fa-regular')
      
    
})
})
