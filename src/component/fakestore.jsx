import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Fakestore = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [total, setTotal] = useState(0);
    const [meterPrice, setMeterPrice] = useState(0);
    const [catCheck, setCatCheck] = useState([]);
    const [rating, setRating] = useState(0);

    const loadCategories = () => {
        axios.get('http://fakestoreapi.com/products/categories')
            .then(response => {
                response.data.unshift('all');
                setCategories(response.data);
            });
    };

    const loadProducts = (url) => {
        axios.get(url)
            .then(response => {

                let filteredProduct = response.data;

                if (catCheck.length > 0) {
                    filteredProduct = filteredProduct.filter(product => {
                        return catCheck.includes(product.category)
                    })
                }
                if (meterPrice > 0) {
                    filteredProduct = filteredProduct.filter(product => {
                        return product.price < meterPrice;
                    })
                }

                if (rating > 0) {
                    filteredProduct = filteredProduct.filter(product => {
                        return product.rating.rate >= rating
                    })
                }


                setProducts(filteredProduct);

            });
    };

    useEffect(() => {
        loadCategories();
        loadProducts('http://fakestoreapi.com/products');
    }, [meterPrice, catCheck,rating]);

    const handleCategoryChange = (e) => {
        if (e.target.value === "all") {
            loadProducts(`http://fakestoreapi.com/products`);
        } else {
            loadProducts(`http://fakestoreapi.com/products/category/${e.target.value}`);
        }
    };

    // functionality 1 delete button functionality;
    const handleCartDeleteClick = (index) => {
        var confirm = window.confirm(`Are your sure?\nWant to Delete?`)
        if (confirm) {
            const cartToUpdate = [...cartItems];
            //getting detail of that product which is going to delete beacuse we have to calculate the total again for all cart item
            const itemToDelete = cartItems[index]
            cartToUpdate.splice(index, 1)
            setCartItems(cartToUpdate);
            setCartCount(cartToUpdate.length)
            setTotal(total - itemToDelete.price)
        }

    };

    const handleAddToCartClick = (id) => {
        axios.get(`http://fakestoreapi.com/products/${id}`)
            .then(res => {
                setCartItems([...cartItems, res.data]);
                setCartCount(cartCount + 1);
                alert(`${res.data.title}\nAdded to Cart`);
            });
    };

    const calculateTotal = () => {
        //option 1
        // var price = 0;
        // for (const item of cartItems) {
        //     var price = item.price + price;
        // }
        // setTotal(price);
        //option : 2
        const totalReducer = (accumulator, currentValue) => {
            return accumulator + currentValue.price;
        }
        const total = cartItems.reduce(totalReducer, 0);
        setTotal(total);
    }

    const handleMeterPrice = (e) => {
        setMeterPrice(e.target.value);
    }

    const handleCheckboxchange = (e) => {
        if (e.target.checked) {
            setCatCheck([...catCheck, e.target.value])
        } else {
            setCatCheck(catCheck.filter((cat) => cat !== e.target.value));
        }
    }

    const handleRadioChange = (e) => {

        setRating(e.target.value)

    }

    console.log("rating", rating);

    return (
        <div className="container-fluid">
            <header className="p-2 d-flex justify-content-between">
                <button data-bs-target="#menu" data-bs-toggle="offcanvas" className="btn btn-dark"> <span className="bi bi-justify"></span> </button>
                <div className="offcanvas offcanvas-start" id="menu">
                    <div className="offcanvas-header">
                        <h2>Filter Products</h2>3
                        <button className="btn btn-close" data-bs-dismiss="offcanvas"></button>
                    </div>
                    <div className="offcanvas-body">
                        <div className="my-2">
                            <label className="form-label fw-bold">Select Category</label>
                            <div>
                                <select onChange={handleCategoryChange} className="form-select">
                                    {categories.map(category =>
                                        <option value={category} key={category}>{category.toUpperCase()}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                        <div className="my-2">
                            <label className="form-label fw-bold">Filter By Category</label>
                            <div>
                                <ul className="list-unstyled" >
                                    <li> <input className="form-check-input" type="checkbox" value="electronics" onChange={handleCheckboxchange} /> Electronics </li>
                                    <li> <input className="form-check-input" type="checkbox" value="jewelery" onChange={handleCheckboxchange} /> Jewelery </li>
                                    <li> <input className="form-check-input" type="checkbox" value="men's clothing" onChange={handleCheckboxchange} /> Men's Fashion </li>
                                    <li> <input className="form-check-input" type="checkbox" value="women's clothing" onChange={handleCheckboxchange} /> Women's Fashion </li>
                                </ul>
                            </div>
                        </div>
                        <div className="my-2">
                            <label className="form-label fw-bold"> Filter By Price </label>
                            <div>
                                <dt>
                                    &#8377; 10 <input type="range" min="10" max="1000" onChange={handleMeterPrice} value={meterPrice} /> &#8377; 1000
                                </dt>
                                <dd>Filter price is : {meterPrice}</dd>
                            </div>
                        </div>

                        <div className="mt-4">
                            <p className="fw-bold">Filter By rating</p>

                            <div className="form-check mt-0  ">
                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value="4" onChange={handleRadioChange} />
                                <label className="form-check-label ms-1" htmlFor="flexRadioDefault1">
                                    4
                                    <span className="bi bi-star-fill ms-1 text-primary"></span>
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" value="3" onChange={handleRadioChange} />
                                <label className="form-check-label ms-1" htmlFor="flexRadioDefault2">
                                    3
                                    <span className="bi bi-star-fill text-success ms-1"></span>
                                </label>
                            </div>

                            <div className="form-check">
                                <input className="form-check-input me-1" type="radio" name="flexRadioDefault" id="flexRadioDefault2" value="2" onChange={handleRadioChange} />
                                <label className="form-check-label " htmlFor="flexRadioDefault2">
                                    &#60; 2
                                    <span className="bi bi-star-fill text-danger ms-1"></span>
                                </label>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="h4">Fakestore.</div>
                <div>
                    <span className="me-3">Home</span>
                    <span className="me-3">Electronics</span>
                    <span className="me-3">Jewelery</span>
                    <span className="me-3">Fashion</span>
                </div>
                <div>
                    <button data-bs-target="#cart" data-bs-toggle="modal" className="btn btn-warning bi bi-cart3 position-relative" onClick={calculateTotal} > <span className="badge bg-danger rounded-circle position-absolute"> {cartCount} </span> </button>
                    <div className="modal fade" id="cart">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h3>Your Cart Items</h3>
                                    <button className="btn btn-close" data-bs-dismiss="modal"></button>
                                </div>
                                <div className="modal-body">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Title</th>
                                                <th>Price</th>
                                                <th>Preview</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cartItems.map((item, index) =>
                                                <tr key={index}>
                                                    <td>{item.title}</td>
                                                    <td>{item.price}</td>
                                                    <td><img width="50" height="50" src={item.image} alt={item.title} /></td>
                                                    <td>
                                                        <button className="bi bi-trash btn btn-danger" onClick={() => handleCartDeleteClick(index)}></button>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td align="center" colSpan="3"> <span className="fw-bold">Total :{total}</span> </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <article className="bg-dark text-white p-2 text-center">
                <span className="bi bi-lightning-fill text-warning"></span>
                HAPPY HOLIDAY OFFERS
                <span className="bi bi-lightning-fill text-warning"></span>
            </article>
            <section className="mt-3 row">
                <nav className="col-2">
                    {/* Navigation content */}
                </nav>
                <main className="col-10 d-flex flex-wrap overflow-auto" style={{ height: '500px' }}>
                    {products.map(product =>
                        <div key={product.id} className="card p-2 m-2" style={{ width: '200px' }}>
                            <img src={product.image} className="card-img-top" height="150" alt={product.title} />
                            <div className="card-header" style={{ height: '120px' }}>
                                {product.title}
                            </div>
                            <div className="card-body">
                                <dl>
                                    <dt>Price</dt>
                                    <dd>{product.price}</dd>
                                    <dt>Rating</dt>
                                    <dd>{product.rating.rate} <span className="bi bi-star-fill text-success"></span> </dd>
                                </dl>
                            </div>
                            <div className="card-footer">
                                <button onClick={() => handleAddToCartClick(product.id)} className="btn btn-warning w-100 bi bi-cart4"> Add to Cart </button>
                            </div>
                        </div>
                    )}
                </main>
            </section>


        </div>
    );
};

export default Fakestore;


