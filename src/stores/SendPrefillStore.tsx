class SendPrefillStore {
    receiver: string = null;
    amount: number = null;

    setReceiver(_receiver: string) {
        this.receiver = _receiver;
    }

    setAmount(_amount: number) {
        this.amount = _amount;
    }

    getReceiver() {
        return this.receiver;
    }

    getAmount() {
        return this.amount;
    }
}

export default (new SendPrefillStore());