import * as React from 'react';
import {Timeline, Icon} from "antd";

class PatchNotesModal extends React.Component<{},{}> {
    render() {
        return <div className="patchNotesModal">
            <div className="patchNotesHelp">
                <Icon type="plus-circle" style={{ fontSize: '16px' }} /> Feature&nbsp;
                <Icon type="exclamation-circle" style={{ fontSize: '16px' }} /> Bugfix&nbsp;
                <Icon type="minus-circle" style={{ fontSize: '16px' }} /> Removal&nbsp;
                <Icon type="check-circle" style={{ fontSize: '16px' }} /> Improval
            </div>
            <Timeline>
                <Timeline.Item dot={<Icon type="loading" style={{ fontSize: '16px' }} spin />}>
                    Contribution guide...
                </Timeline.Item>
                <Timeline.Item dot={<Icon type="loading" style={{ fontSize: '16px' }} spin />}>
                    Transaction notification...
                </Timeline.Item>
                <Timeline.Item dot={<Icon type="loading" style={{ fontSize: '16px' }} spin />}>
                    Explorer...
                </Timeline.Item>
                <Timeline.Item dot={<Icon type="plus-circle" style={{ fontSize: '16px' }} />} color="green">
                    <p><strong>v0.0.14</strong></p>
                    <p> - Changed from garlicoin-cli to JsonRPC calls</p>
                </Timeline.Item>
                <Timeline.Item dot={<Icon type="exclamation-circle" style={{ fontSize: '16px' }} />} color="yellow">
                    <p><strong>v0.0.13.1</strong></p>
                    <p> - Fixed config loading error</p>
                </Timeline.Item>
                <Timeline.Item dot={<Icon type="plus-circle" style={{ fontSize: '16px' }} />} color="green">
                    <p><strong>v0.0.13</strong></p>
                    <p> - About page</p>
                    <p> - Patchnotes</p>
                </Timeline.Item>
                <Timeline.Item dot={<Icon type="plus-circle" style={{ fontSize: '16px' }} />} color="green">
                    <p><strong>v0.0.12</strong></p>
                    <p> - Address List</p>
                    <p> - Code cleanup</p>
                    <p> - Translations</p>
                    <p> - Reordering of components</p>
                    <p> - Transactions got own component</p>
                    <p> - New api commands</p>
                </Timeline.Item>
                <Timeline.Item dot={<Icon type="plus-circle" style={{ fontSize: '16px' }} />} color="green">
                    <strong>v0.0.11</strong> Send coins
                </Timeline.Item>
                <Timeline.Item dot={<Icon type="plus-circle" style={{ fontSize: '16px' }} />} color="green">
                    <strong>v0.0.4</strong> Wallet
                </Timeline.Item>
                <Timeline.Item dot={<Icon type="plus-circle" style={{ fontSize: '16px' }} />} color="green">
                    <strong>v0.0.1</strong> Creation
                </Timeline.Item>
            </Timeline>
        </div>;
    }
}

export default PatchNotesModal;