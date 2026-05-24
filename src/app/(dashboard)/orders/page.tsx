'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Trash2, Receipt, QrCode, Banknote, X, ClipboardList, Filter, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import generatePayload from 'promptpay-qr';
import { usePromptPay } from '@/hooks/usePromptPay';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { onMenusSnapshot, addOrder, onOrdersSnapshot, deleteOrder, deleteAllOrders } from '@/firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import type { MenuItem, Order, OrderItem } from '@/types';
import { format, parseISO } from 'date-fns';

export default function OrdersPage() {
  const { user } = useAuth();
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qr'>('cash');
  const [submitting, setSubmitting] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [cashReceived, setCashReceived] = useState<number | ''>('');
  const receiptRef = useRef<HTMLDivElement>(null);
  const { promptPayId } = usePromptPay();

  useEffect(() => {
    const u1 = onMenusSnapshot(setMenus);
    const u2 = onOrdersSnapshot(setOrders);
    return () => { u1(); u2(); };
  }, []);

  const filteredMenus = menus.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredOrders = orders.filter((o) => {
    const matchDate = !dateFilter || o.createdAt.startsWith(dateFilter);
    const matchPayment = paymentFilter === 'all' || o.paymentMethod === paymentFilter;
    return matchDate && matchPayment;
  });

  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  function addToCart(menu: MenuItem) {
    setCart((prev) => {
      const existing = prev.find((i) => i.menuId === menu.id);
      if (existing) return prev.map((i) => i.menuId === menu.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { menuId: menu.id, name: menu.name, price: menu.price, quantity: 1 }];
    });
  }

  function updateQty(menuId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((i) => i.menuId === menuId ? { ...i, quantity: i.quantity + delta } : i)
        .filter((i) => i.quantity > 0)
    );
  }

  function removeFromCart(menuId: string) {
    setCart((prev) => prev.filter((i) => i.menuId !== menuId));
  }

  async function handleSubmitOrder() {
    if (cart.length === 0) { toast.error('Cart is empty'); return; }
    if (paymentMethod === 'cash' && cashReceived !== '' && cashReceived < cartTotal) {
      toast.error('Cash received is less than total');
      return;
    }
    if (paymentMethod === 'qr') { setQrOpen(true); return; }
    await placeOrder();
  }

  const changeAmount = cashReceived !== '' ? cashReceived - cartTotal : null;

  async function placeOrder() {
    setSubmitting(true);
    try {
      const docRef = await addOrder({
        items: cart,
        total: cartTotal,
        paymentMethod,
        customerNote: note,
        staffId: user?.uid || '',
      });
      const newOrder: Order = {
        id: docRef.id,
        items: cart,
        total: cartTotal,
        paymentMethod,
        customerNote: note,
        staffId: user?.uid || '',
        createdAt: new Date().toISOString(),
        cashReceived: paymentMethod === 'cash' && cashReceived !== '' ? cashReceived as number : undefined,
      };
      toast.success('Order placed!');
      setCart([]);
      setNote('');
      setCashReceived('');
      setQrOpen(false);
      setReceiptOrder(newOrder);
    } catch {
      toast.error('Failed to place order');
    } finally {
      setSubmitting(false);
    }
  }

  function printReceipt() {
    window.print();
  }

  async function handleClearAll() {
    setClearing(true);
    try {
      await deleteAllOrders();
      toast.success('All orders cleared!');
      setClearConfirmOpen(false);
    } catch {
      toast.error('Failed to clear orders');
    } finally {
      setClearing(false);
    }
  }

  async function handleDeleteOrder(id: string) {
    await deleteOrder(id);
    toast.success('Order deleted');
  }

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold">POS / Orders</h1>
        <p className="text-muted-foreground text-sm">Create orders and view order history</p>
      </motion.div>

      <Tabs defaultValue="pos">
        <TabsList>
          <TabsTrigger value="pos"><ShoppingCart className="h-4 w-4 mr-2" />POS</TabsTrigger>
          <TabsTrigger value="history"><ClipboardList className="h-4 w-4 mr-2" />History ({orders.length})</TabsTrigger>
        </TabsList>

        {/* POS Tab */}
        <TabsContent value="pos">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
            {/* Menu Grid */}
            <div className="lg:col-span-2 space-y-3">
              <Input
                placeholder="Search menu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {filteredMenus.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ShoppingCart className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No menu items. Add some in Menu Management first.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filteredMenus.map((menu, i) => {
                    const cartItem = cart.find((c) => c.menuId === menu.id);
                    return (
                      <motion.div
                        key={menu.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <Card
                          className="cursor-pointer hover:shadow-md transition-shadow border-border/60 overflow-hidden"
                          onClick={() => addToCart(menu)}
                        >
                          <div className="relative h-28 bg-muted">
                            {menu.image ? (
                              <img src={menu.image} alt={menu.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-3xl">🧇</div>
                            )}
                            {cartItem && (
                              <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                                {cartItem.quantity}
                              </div>
                            )}
                          </div>
                          <CardContent className="p-2">
                            <p className="text-xs font-semibold truncate">{menu.name}</p>
                            <p className="text-primary text-sm font-bold">฿{menu.price}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cart */}
            <div className="space-y-3">
              <Card className="border-border/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" /> Cart
                    {cartCount > 0 && <Badge>{cartCount}</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {cart.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Tap items to add to cart</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      <AnimatePresence>
                        {cart.map((item) => (
                          <motion.div
                            key={item.menuId}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex items-center gap-2"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">{item.name}</p>
                              <p className="text-xs text-muted-foreground">฿{item.price} ea</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQty(item.menuId, -1)}>
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                              <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQty(item.menuId, 1)}>
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => removeFromCart(item.menuId)}>
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <span className="text-xs font-semibold w-14 text-right">฿{item.price * item.quantity}</span>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}

                  {cart.length > 0 && (
                    <>
                      <div className="border-t border-border pt-2 flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-primary text-lg">฿{cartTotal}</span>
                      </div>

                      {paymentMethod === 'cash' && (
                        <div className="space-y-2">
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cash Received (฿)</Label>
                            <div className="relative">
                              <Input
                                type="number"
                                min={0}
                                step={1}
                                placeholder={`Min ฿${cartTotal}`}
                                value={cashReceived}
                                onChange={(e) => setCashReceived(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                className="text-sm pr-10"
                              />
                              {cashReceived !== '' && cashReceived >= cartTotal && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 text-xs">✓</span>
                              )}
                            </div>
                            {/* Quick cash buttons */}
                            <div className="flex flex-wrap gap-1.5">
                              {[20, 50, 100, 500, 1000].map((amt) => (
                                <button
                                  key={amt}
                                  type="button"
                                  onClick={() => setCashReceived(amt)}
                                  className="text-[10px] font-semibold px-2 py-1 rounded border border-border bg-muted hover:bg-accent hover:text-accent-foreground transition-colors"
                                >
                                  ฿{amt}
                                </button>
                              ))}
                            </div>
                          </div>

                          {changeAmount !== null && (
                            <div className={`flex justify-between items-center p-2.5 rounded-lg text-sm font-bold ${
                              changeAmount >= 0
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              <span>{changeAmount >= 0 ? '💰 Change' : '⚠️ Short'}</span>
                              <span className="text-base">฿{Math.abs(changeAmount)}</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <Label className="text-xs">Customer Note</Label>
                        <Textarea
                          placeholder="Special requests..."
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          className="text-xs h-16 resize-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs">Payment</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPaymentMethod('cash')}
                            className="text-xs"
                          >
                            <Banknote className="h-3 w-3 mr-1" /> Cash
                          </Button>
                          <Button
                            variant={paymentMethod === 'qr' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPaymentMethod('qr')}
                            className="text-xs"
                          >
                            <QrCode className="h-3 w-3 mr-1" /> QR
                          </Button>
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        onClick={handleSubmitOrder}
                        disabled={submitting || (paymentMethod === 'cash' && cashReceived !== '' && (cashReceived as number) < cartTotal)}
                      >
                        {submitting ? 'Processing...' : `Place Order · ฿${cartTotal}`}
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => setCart([])}>
                        Clear Cart
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <div className="mt-4 space-y-3">
            {/* Filters + Clear All */}
            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
              <div className="flex items-center gap-2 flex-1 flex-wrap">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="text-xs px-2 py-1.5 rounded-md border border-border bg-background text-foreground"
                />
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="text-xs px-2 py-1.5 rounded-md border border-border bg-background text-foreground"
                >
                  <option value="all">All Payments</option>
                  <option value="cash">Cash</option>
                  <option value="qr">QR</option>
                </select>
                {(dateFilter || paymentFilter !== 'all') && (
                  <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => { setDateFilter(''); setPaymentFilter('all'); }}>
                    <X className="h-3 w-3 mr-1" /> Reset Filter
                  </Button>
                )}
                <span className="text-xs text-muted-foreground">{filteredOrders.length} orders</span>
              </div>
              {orders.length > 0 && (
                <Button size="sm" variant="destructive" className="text-xs" onClick={() => setClearConfirmOpen(true)}>
                  <Trash2 className="h-3 w-3 mr-1" /> Clear All History
                </Button>
              )}
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>{orders.length === 0 ? 'No orders yet' : 'No orders match the filter'}</p>
              </div>
            ) : (
              <Card className="border-border/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Order History</CardTitle>
                  <CardDescription>Showing {filteredOrders.length} of {orders.length} orders</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Payment</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Note</TableHead>
                          <TableHead className="text-right">Receipt</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                              {(() => { try { return format(parseISO(order.createdAt), 'MMM d, HH:mm'); } catch { return '—'; } })()}
                            </TableCell>
                            <TableCell className="text-xs max-w-[200px] truncate">
                              {order.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs uppercase">{order.paymentMethod}</Badge>
                            </TableCell>
                            <TableCell className="font-semibold text-primary">฿{order.total}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{order.customerNote || '—'}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button size="sm" variant="ghost" onClick={() => setReceiptOrder(order)}>
                                  <Receipt className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDeleteOrder(order.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Clear All Confirm Dialog */}
      <Dialog open={clearConfirmOpen} onOpenChange={setClearConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" /> Clear All History?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently delete all <strong>{orders.length} orders</strong>. This cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClearConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleClearAll} disabled={clearing}>
              {clearing ? 'Clearing...' : 'Yes, Clear All'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Payment Dialog */}
      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="max-w-xs text-center">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2">
              <QrCode className="h-4 w-4" /> PromptPay
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-4xl font-bold text-primary">฿{cartTotal.toLocaleString()}</div>

            {promptPayId ? (
              <div className="bg-white rounded-2xl p-4 flex items-center justify-center mx-auto w-fit shadow-sm">
                <QRCodeSVG
                  value={generatePayload(promptPayId, { amount: cartTotal })}
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#1a1a1a"
                  level="M"
                  imageSettings={{
                    src: '/logo.png',
                    height: 36,
                    width: 36,
                    excavate: true,
                  }}
                />
              </div>
            ) : (
              <div className="bg-muted rounded-xl p-8 flex flex-col items-center gap-2 text-muted-foreground">
                <QrCode className="h-10 w-10 opacity-30" />
                <p className="text-xs">No PromptPay ID set.<br />Go to profile settings to add one.</p>
              </div>
            )}

            {promptPayId && (
              <p className="text-xs text-muted-foreground">ID: {promptPayId}</p>
            )}

            <p className="text-sm text-muted-foreground">Show this QR to the customer.<br />Confirm once payment is received.</p>

            <Button className="w-full gap-2" onClick={placeOrder} disabled={submitting}>
              {submitting
                ? <><Receipt className="h-4 w-4 animate-spin" /> Processing…</>
                : <><CheckCircle2 className="h-4 w-4" /> Confirm Payment Received</>}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={!!receiptOrder} onOpenChange={() => setReceiptOrder(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Receipt</DialogTitle>
          </DialogHeader>
          {receiptOrder && (
            <div ref={receiptRef} className="space-y-3 text-sm">
              <div className="text-center border-b border-border pb-3">
                <p className="text-2xl">🧇</p>
                <p className="font-bold text-lg">Barn Waffles</p>
                <p className="text-xs text-muted-foreground">บ้าน Waffles</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {(() => { try { return format(parseISO(receiptOrder.createdAt), 'MMM d, yyyy HH:mm'); } catch { return '—'; } })()}
                </p>
              </div>
              <div className="space-y-1.5">
                {receiptOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{item.name} ×{item.quantity}</span>
                    <span>฿{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary">฿{receiptOrder.total}</span>
              </div>
              <div className="text-xs text-muted-foreground space-y-0.5">
                <p>Payment: {receiptOrder.paymentMethod.toUpperCase()}</p>
                {receiptOrder.cashReceived != null && (
                  <>
                    <p>Cash: ฿{receiptOrder.cashReceived}</p>
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400">Change: ฿{receiptOrder.cashReceived - receiptOrder.total}</p>
                  </>
                )}
                {receiptOrder.customerNote && <p>Note: {receiptOrder.customerNote}</p>}
              </div>
              <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border">
                Thank you for visiting Barn Waffles! 🧇
              </div>
              <Button className="w-full mt-2" onClick={printReceipt} variant="outline">
                <Receipt className="h-4 w-4 mr-2" /> Print Receipt
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
