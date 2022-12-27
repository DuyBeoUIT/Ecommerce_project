// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract PurchaseAgreement {
    uint public value;
    uint internal starttime;
    uint internal currenttime;
    address payable public seller;
    address payable public buyer;
    address payable public shipper;
    
    enum State { Created, Locked, Release, Inactive }
    State public state;

    enum OrderState {Pending , Paid, Delivering, Bomhang, Completed, Cancelled, Failed}
    OrderState public orderstate;

    constructor() payable {
        seller = payable(msg.sender);
        value = msg.value;
    }

    /// The function cannot be called at the current state.
    error InvalidState();
    ///  Ony the buyer can call this function
    error OnlyBuyer();
    ///  Ony the seller can call this function
    error OnlySeller();
    /// Ony the shipper can call this function
    error OnlyShipper();
    ///  call this function to check order state
    error InStateOrder();

    modifier inState(State state_) {
        if (state != state_) {
            revert InvalidState();
        }
        _;
    }

    modifier inStateOrder(OrderState orderstate_) {
        if (orderstate != orderstate_) {
            revert InStateOrder();
        }
        _;
    }

    modifier onlyBuyer() {
        if (msg.sender != buyer) {
            revert OnlyBuyer();
        }
        _;
    }

    modifier onlySeller() {
        if (msg.sender != seller) {
            revert OnlySeller();
        }
        _;
    }

    modifier onlyShipper() {
        if (msg.sender != shipper) {
            revert OnlyShipper();
        }
        _;
    }
    
    //public infomation
    function getState() public view returns(State){
        return state;
    }

    function getOrderState() public view returns(OrderState){
        return orderstate;
    }

    //Start Buyer
    function confirmPurchase() external inState(State.Created) inStateOrder(OrderState.Pending) payable {
        require(msg.value == value, "Please send in the purchase amount");
        buyer = payable(msg.sender);
        state = State.Locked;
        orderstate = OrderState.Paid;
        starttime = block.timestamp;
    }

    function cancelByBuyer() external onlyBuyer inState(State.Locked) inStateOrder(OrderState.Paid){
        currenttime = block.timestamp;
        require(currenttime <= starttime + 5 hours, "Timeout to cancle the order");
        state = State.Inactive;
        orderstate = OrderState.Cancelled;
        buyer.transfer(value);
    } 
    //End Buyer 

    //Start Shipper
    function confirmReceived() external onlyShipper inState(State.Locked) inStateOrder(OrderState.Delivering){
        state = State.Release;
        orderstate = OrderState.Completed;
    }

    function confirmBomhang() external onlyShipper inState(State.Locked) inStateOrder(OrderState.Delivering){
        orderstate = OrderState.Bomhang;
    }
    //End Shipper
    

    //Start Seller
    function inputAccShipper(address payable acc) external onlySeller inState(State.Locked) inStateOrder(OrderState.Paid){
        currenttime = block.timestamp;
        require(currenttime > starttime + 20 seconds, "Wait cancelation time is expired");
        shipper = acc;
        orderstate = OrderState.Delivering;
    }

    function paySeller() external onlySeller inState(State.Release) inStateOrder(OrderState.Completed){
      state = State.Inactive;
      seller.transfer(2 * value);
    }

    function abort() external onlySeller inState(State.Created) inStateOrder(OrderState.Pending){
        state = State.Inactive;
        orderstate = OrderState.Cancelled;
        seller.transfer(address(this).balance);
    }

    function bomhang() external onlySeller inState(State.Locked) inStateOrder(OrderState.Bomhang){
        state = State.Inactive;
        orderstate = OrderState.Failed;
        seller.transfer(value + value/2);
        buyer.transfer(value/2);
    }
    //End Seller
}