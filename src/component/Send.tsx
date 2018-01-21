import * as React from "react";

interface TSendProps {}
interface TSendState {
}

class Send extends React.Component<TSendProps, TSendState> {
    private mounted = false;

    constructor(props: TSendProps) {
        super(props);
        this.state = {
            balance: -1,
        }
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    render() {
        return (
            <div>
                Send coins
            </div>
        );
    }
}

export default Send;