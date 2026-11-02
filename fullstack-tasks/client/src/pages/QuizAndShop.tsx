import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Plus,
  Minus,
  Trash2,
  Search,
  ShoppingCart,
  X,
  ShieldCheck,
  Star,
  Check
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'Which HTTP method is specifically intended to be idempotent and retrieve a resource without side effects?',
    options: ['POST', 'GET', 'PATCH', 'CONNECT'],
    correctIndex: 1,
    explanation: 'GET requests should be idempotent and only retrieve data without changing server state.'
  },
  {
    id: 2,
    question: 'In React, what hook is used to perform side effects such as data fetching or DOM subscriptions?',
    options: ['useState', 'useMemo', 'useEffect', 'useCallback'],
    correctIndex: 2,
    explanation: 'useEffect handles side effects such as subscriptions, network calls, and manual DOM mutations.'
  },
  {
    id: 3,
    question: 'Which of the following CSS units is calculated relative to the root font-size of the document?',
    options: ['em', 'rem', 'vh', '%'],
    correctIndex: 1,
    explanation: 'rem stands for "root em" and is always relative to the <html> root font size (usually 16px by default).'
  },
  {
    id: 4,
    question: 'What is the primary advantage of SQLite compared to client-server databases like PostgreSQL?',
    options: [
      'It supports infinite distributed clusters',
      'Zero-configuration serverless file-based storage',
      'It has no SQL syntax',
      'It requires a dedicated daemon process'
    ],
    correctIndex: 1,
    explanation: 'SQLite writes directly to a single disk file without requiring a separate database server process.'
  },
  {
    id: 5,
    question: 'What does the JavaScript event loop prioritize before executing tasks from the macrotask queue?',
    options: ['setTimeout callbacks', 'Microtask queue (Promises)', 'setInterval ticks', 'DOM rendering'],
    correctIndex: 1,
    explanation: 'The microtask queue (Promise callbacks, queueMicrotask) is completely drained after each task before the next macrotask runs.'
  },
  {
    id: 6,
    question: 'Which HTTP status code signifies that a resource was successfully created on the server?',
    options: ['200 OK', '201 Created', '204 No Content', '301 Moved'],
    correctIndex: 1,
    explanation: '201 Created is the standard REST status code returned after a successful POST creating a new resource.'
  },
  {
    id: 7,
    question: 'In modern CSS Flexbox, which property aligns items along the cross axis?',
    options: ['justify-content', 'align-items', 'flex-direction', 'gap'],
    correctIndex: 1,
    explanation: 'align-items controls alignment along the cross-axis, while justify-content aligns along the main axis.'
  },
  {
    id: 8,
    question: 'What is the purpose of the key prop when rendering lists in React?',
    options: [
      'To pass inline CSS styles to the DOM',
      'To help React identify which items have changed, been added, or removed',
      'To sort the list alphabetically',
      'To prevent the browser from caching data'
    ],
    correctIndex: 1,
    explanation: 'Keys give elements a stable identity so React can efficiently reconcile and update the virtual DOM.'
  },
  {
    id: 9,
    question: 'Which of the following is NOT a valid JSON data type?',
    options: ['Array', 'Object', 'Function', 'Boolean'],
    correctIndex: 2,
    explanation: 'JSON supports strings, numbers, booleans, null, arrays, and objects. Functions and undefined are not valid in JSON.'
  },
  {
    id: 10,
    question: 'What security header helps mitigate cross-site scripting (XSS) by restricting where resources can be loaded from?',
    options: ['CORS Access-Control', 'Content-Security-Policy (CSP)', 'X-Frame-Options', 'ETag'],
    correctIndex: 1,
    explanation: 'Content-Security-Policy (CSP) restricts executable scripts and resource origins to protect against XSS.'
  }
];

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews_count: number;
  description: string;
  image: string;
  badge?: string;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

export const QuizAndShop: React.FC = () => {
  const [mode, setMode] = useState<'quiz' | 'shop'>('quiz');

  /* ------------------- QUIZ STATE ------------------- */
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentQIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;

  const handleSelectOption = (index: number) => {
    if (selectedAnswers[currentQIndex] !== undefined) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQIndex]: index }));
  };

  const handleNext = () => {
    if (currentQIndex < totalQuestions - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex((prev) => prev - 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  const restartQuiz = () => {
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setQuizFinished(false);
  };

  /* ------------------- SHOP STATE ------------------- */
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [shopSearch, setShopSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<any | null>(null);

  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: ''
  });
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
      })
      .catch(() => {
        // Fallback catalogue if needed
        setProducts([]);
      });
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQ = item.quantity + delta;
            return newQ > 0 ? { ...item, quantity: newQ } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartTax = cartSubtotal * 0.08;
  const cartTotal = cartSubtotal + cartTax;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutForm.name || !checkoutForm.email || !checkoutForm.address) {
      alert('Please complete all required shipping fields.');
      return;
    }

    setPlacingOrder(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: checkoutForm.name,
          email: checkoutForm.email,
          address: checkoutForm.address,
          city: checkoutForm.city,
          postal_code: checkoutForm.zip,
          total_amount: cartTotal,
          items: cart.map((i) => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price }))
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');

      setOrderConfirmed(data.order);
      setCart([]);
      setIsCheckoutOpen(false);
    } catch (err: any) {
      alert(`Could not place order: ${err.message}`);
    } finally {
      setPlacingOrder(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(shopSearch.toLowerCase()) ||
                          p.description.toLowerCase().includes(shopSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Mode Navigation Bar */}
      <div className="scamshield-card p-6 bg-white border border-[#E5E7EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              PROJECT 05
            </span>
            <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded">
              Interactive Quiz & E-Commerce
            </span>
          </div>
          <h1 className="text-xl font-semibold text-[#172033]">
            {mode === 'quiz' ? 'Web Development Fundamentals Quiz' : 'Developer Hardware & Books Store'}
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            {mode === 'quiz'
              ? 'Test your knowledge with 10 questions and immediate answer explanations.'
              : 'Product catalog with cart drawer, quantity controls, and SQLite order persistence.'}
          </p>
        </div>

        {/* Mode Switcher Buttons */}
        <div className="flex items-center gap-1 border border-[#E5E7EB] rounded-lg p-1 bg-[#F8FAFC]">
          <button
            onClick={() => setMode('quiz')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
              mode === 'quiz' ? 'bg-white text-[#2563EB] shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Quiz Mode</span>
          </button>
          <button
            onClick={() => setMode('shop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
              mode === 'shop' ? 'bg-white text-[#2563EB] shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Store Mode ({cart.length})</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
           MODE 1: QUIZ
           ========================================================================= */}
      {mode === 'quiz' && (
        <div className="space-y-6">
          {!quizFinished ? (
            <div className="scamshield-card p-7 space-y-6 bg-white border border-[#E5E7EB]">
              {/* Progress header */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Question {currentQIndex + 1} of {totalQuestions}</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {Math.round(((currentQIndex + 1) / totalQuestions) * 100)}% Completed
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#2563EB] h-2 transition-all duration-300"
                    style={{ width: `${((currentQIndex + 1) / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="pt-2">
                <h2 className="text-base font-bold text-[#172033] leading-snug">
                  {currentQ.question}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const hasAnswered = selectedAnswers[currentQIndex] !== undefined;
                  const isSelected = selectedAnswers[currentQIndex] === idx;
                  const isCorrect = idx === currentQ.correctIndex;

                  let optionStyle = 'border-[#E5E7EB] hover:border-slate-300 bg-white';
                  if (hasAnswered) {
                    if (isCorrect) {
                      optionStyle = 'border-emerald-500 bg-emerald-50/50 text-emerald-950 font-medium';
                    } else if (isSelected) {
                      optionStyle = 'border-rose-400 bg-rose-50/50 text-rose-950';
                    } else {
                      optionStyle = 'opacity-50 border-slate-200 bg-white';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={hasAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 transition-all cursor-pointer ${optionStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-mono font-bold text-[11px] flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-relaxed">{opt}</span>
                      </div>
                      {hasAnswered && (
                        <span>
                          {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                          {isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600" />}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation note when answered */}
              {selectedAnswers[currentQIndex] !== undefined && (
                <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed">
                  <strong>Explanation:</strong> {currentQ.explanation}
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={handlePrev}
                  disabled={currentQIndex === 0}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Previous
                </button>

                <button
                  onClick={handleNext}
                  disabled={selectedAnswers[currentQIndex] === undefined}
                  className="inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold px-5 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-40"
                >
                  <span>{currentQIndex === totalQuestions - 1 ? 'Finish Quiz' : 'Next Question'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="scamshield-card p-8 text-center space-y-6 max-w-xl mx-auto bg-white border border-[#E5E7EB]">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#172033]">Quiz Completed!</h2>
                <p className="text-xs text-[#64748B] mt-1">
                  You scored <strong className="text-slate-900 font-mono text-sm">{calculateScore()}</strong> out of{' '}
                  <strong className="text-slate-900 font-mono text-sm">{totalQuestions}</strong> correct (
                  {Math.round((calculateScore() / totalQuestions) * 100)}%).
                </p>
              </div>

              <div className="p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-xs text-slate-600">
                {calculateScore() >= 8 ? (
                  <span className="text-emerald-700 font-medium">
                    🏆 Excellent! You have a solid grasp of web development fundamentals and HTTP paradigms.
                  </span>
                ) : (
                  <span className="text-slate-700">
                    Good effort! Review the explanations to reinforce your core concepts.
                  </span>
                )}
              </div>

              <button
                onClick={restartQuiz}
                className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart Quiz</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
           MODE 2: E-COMMERCE STORE
           ========================================================================= */}
      {mode === 'shop' && (
        <div className="space-y-6">
          {/* Order confirmation banner if created */}
          {orderConfirmed && (
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Order Placed Successfully in SQLite Database!</span>
              </div>
              <div className="text-xs text-emerald-700">
                Order ID: <strong className="font-mono">{orderConfirmed.order_number}</strong> • Amount: ₹
                {orderConfirmed.total_amount.toFixed(2)} • Status: {orderConfirmed.status}
              </div>
            </div>
          )}

          {/* Shop toolbar: Search + Category chips */}
          <div className="scamshield-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={shopSearch}
                onChange={(e) => setShopSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-white border border-[#E5E7EB] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#172033] focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {['All', 'Peripherals', 'Hardware', 'Books', 'Audio', 'Accessories'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#2563EB] text-white shadow-xs font-semibold'
                      : 'bg-[#F8FAFC] text-slate-600 hover:bg-slate-200 border border-[#E5E7EB]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-[#172033] text-xs font-semibold px-4 py-2 rounded-lg border border-[#E5E7EB] transition-colors relative shadow-xs shrink-0"
            >
              <ShoppingCart className="w-4 h-4 text-blue-600" />
              <span>Cart ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
            </button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="scamshield-card scamshield-card-hover p-4 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-full h-40 rounded-lg overflow-hidden bg-slate-100 relative mb-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                    />
                    {p.badge && (
                      <span className="absolute top-2 left-2 bg-[#2563EB] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                        {p.badge}
                      </span>
                    )}
                  </div>

                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {p.category}
                  </div>
                  <h3
                    onClick={() => setSelectedProduct(p)}
                    className="text-xs font-bold text-[#172033] hover:text-[#2563EB] cursor-pointer mt-0.5 line-clamp-1"
                  >
                    {p.name}
                  </h3>
                  <p className="text-[11px] text-[#64748B] line-clamp-2 mt-1 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-[#172033] font-mono">₹{p.price.toFixed(2)}</div>
                    <div className="text-[10px] text-amber-500 flex items-center gap-0.5 font-medium">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {p.rating}
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(p)}
                    className="inline-flex items-center gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Product Details Modal */}
          {selectedProduct && (
            <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="scamshield-card p-6 bg-white max-w-lg w-full space-y-4 relative shadow-xl">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="w-full h-56 rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">
                    {selectedProduct.category}
                  </span>
                  <h3 className="text-base font-bold text-[#172033] mt-1.5">{selectedProduct.name}</h3>
                  <p className="text-xs text-[#64748B] mt-2 leading-relaxed">{selectedProduct.description}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="text-lg font-bold text-[#172033] font-mono">
                    ₹{selectedProduct.price.toFixed(2)}
                  </div>
                  <button
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold px-5 py-2.5 rounded-lg"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Slide-over Cart Drawer */}
          {isCartOpen && (
            <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs flex justify-end z-50">
              <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-blue-600" />
                      <h3 className="text-sm font-bold text-[#172033]">Shopping Cart ({cart.length})</h3>
                    </div>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 max-h-[55vh] overflow-y-auto pr-1 my-4">
                    {cart.length === 0 ? (
                      <p className="text-xs text-slate-400 py-10 text-center">Your cart is empty.</p>
                    ) : (
                      cart.map((item) => (
                        <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded object-cover border border-slate-100"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-medium text-[#172033] truncate">{item.name}</h4>
                            <div className="text-xs font-mono font-semibold text-slate-700 mt-0.5">
                              ₹{item.price.toFixed(2)}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 border border-slate-200 rounded px-1.5 py-0.5">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="text-slate-500 hover:text-slate-800"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-mono font-semibold w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="text-slate-500 hover:text-slate-800"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {cart.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-mono">₹{cartSubtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Tax (8%)</span>
                        <span className="font-mono">₹{cartTax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-100">
                        <span>Total</span>
                        <span className="font-mono text-[#2563EB]">₹{cartTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        setIsCheckoutOpen(true);
                      }}
                      className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold py-2.5 rounded-lg shadow-sm"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Checkout Modal (Stores in SQLite) */}
          {isCheckoutOpen && (
            <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="scamshield-card p-6 bg-white max-w-md w-full space-y-4 relative shadow-xl">
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>

                <div>
                  <h3 className="text-base font-bold text-[#172033]">Checkout & Place Order</h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Orders are validated and stored persistently in the backend SQLite database.
                  </p>
                </div>

                <form onSubmit={handleCheckoutSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={checkoutForm.name}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                      placeholder="e.g. Aryan Singh"
                      className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={checkoutForm.email}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                      placeholder="e.g. aryan@example.com"
                      className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Delivery Address *</label>
                    <input
                      type="text"
                      required
                      value={checkoutForm.address}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                      placeholder="e.g. 104 Sector 44"
                      className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-700">City *</label>
                      <input
                        type="text"
                        required
                        value={checkoutForm.city}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, city: e.target.value })}
                        placeholder="e.g. Noida"
                        className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-700">Postal Code *</label>
                      <input
                        type="text"
                        required
                        value={checkoutForm.zip}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, zip: e.target.value })}
                        placeholder="e.g. 201301"
                        className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between text-slate-600">
                      <span>Total Amount:</span>
                      <strong className="font-mono text-slate-900">₹{cartTotal.toFixed(2)}</strong>
                    </div>
                    <div className="text-[11px] text-slate-400">Payment: Cash on Delivery / UPI Simulation</div>
                  </div>

                  <button
                    type="submit"
                    disabled={placingOrder}
                    className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-60"
                  >
                    {placingOrder ? 'Recording Order in Database...' : 'Confirm & Place Order'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
