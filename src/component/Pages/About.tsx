import * as React from 'react';
import {Divider, List, Icon, Button, Modal} from "antd";
import {FormattedMessage} from 'react-intl';
import {remote} from "electron";
import PatchNotesModal from "./About/PatchNotesModal";

interface TAboutListItem {
    title: string | JSX.Element;
    description: string | JSX.Element;
    icon: string,
}

interface TAboutProps {}
interface TAboutState {
    patchNotesOpen: boolean;
}

class About extends React.Component<TAboutProps, TAboutState> {

    constructor(_props: TAboutProps) {
        super(_props);
        this.state = {
            patchNotesOpen: false
        }
    }

    render() {
        let dataSource: TAboutListItem[] = [
            {
                title: <FormattedMessage id="about.version"
                                         defaultMessage="Version" />,
                description: remote.app.getVersion() + " (alpha)",
                icon: 'tag'
            },
            {
                title: <FormattedMessage id="about.developers"
                                         defaultMessage="Developers" />,
                description: <a href="https://github.com/SidiaDevelopment" target="_blank">Sidia</a>,
                icon: 'code'
            },
            {
                title: <FormattedMessage id="about.error"
                                         defaultMessage="Issue Reporting" />,
                description: <span>
                    <FormattedMessage id="about.error.message"
                                      defaultMessage="If you encountered a bug, please report it in the {bugtracker} or {discord}"
                                      values={{
                                          bugtracker: <a href="https://github.com/SidiaDevelopment/GarlicoinWallet/issues" target="_blank">
                                              <FormattedMessage id="about.error.message.bugtracker"
                                                                defaultMessage="Bugtracker" />
                                          </a>,
                                          discord: <a href="https://discord.gg/VqbXCgs" target="_blank">
                                              <FormattedMessage id="about.error.message.discord"
                                                                defaultMessage="Discord" />
                                          </a>
                                      }}/>&nbsp;
                </span>,
                icon: 'exclamation-circle'
            },
            {
                title: <FormattedMessage id="about.donate"
                                         defaultMessage="Donate for the developers" />,
                description: <FormattedMessage id="about.contributing.message"
                                               defaultMessage="Want to help but can't code yourself? Assist us by donating GRLC to: GW6JqEqVYsGsZpQpnaGfTJzXjGvjwYJFw9" />,
                icon: 'smile'
            },
            {
                title: <FormattedMessage id="about.chat"
                                         defaultMessage="Chat with us" />,
                description: <span>
                        <FormattedMessage id="about.contributing.chat.message"
                                          defaultMessage="You can always reach out to us on the" />&nbsp;
                        <a href="https://discord.gg/VqbXCgs">
                            <FormattedMessage id="about.error.message.discord"
                                              defaultMessage="Discord" />
                        </a>
                    </span>,
                icon: 'message'
            },
            {
                title: <FormattedMessage id="about.partners"
                                         defaultMessage="Our partners" />,
                description: <span>
                    <FormattedMessage id="about.partners.message"
                                      defaultMessage="Visit the website of my coding partner stackola:" />&nbsp;
                    <a href="http://small.garlicky.fun">Garlicky Gambling</a>
                </span>,
                icon: 'global'
            },
            {
                title: <FormattedMessage id="about.repository"
                                         defaultMessage="Repository" />,
                description: <span>
                    <a href="https://github.com/SidiaDevelopment/GarlicoinWallet">Github</a>
                </span>,
                icon: 'github'
            },
        ];
        return <div id="about">
            <div className="branding">
                <img src="client/img/logo-full-black.png" />
            </div>
            <Divider><FormattedMessage id="about.divider.information" defaultMessage="Informations" /></Divider>
            <List className="detaillist" dataSource={dataSource} renderItem={
                (item: TAboutListItem) => {
                    return <List.Item>
                        <List.Item.Meta
                            avatar={<Icon type={item.icon}/>}
                            title={item.title}
                            description={item.description}
                        />
                    </List.Item>
                }
            }/>
            <div className="patchNotes">
                <Button onClick={this.openPatchNotes}><FormattedMessage id="about.open_patch_notes" defaultMessage="Open patchnotes" /></Button>
                <Modal
                    title={<FormattedMessage id="about.patch_notes.title" defaultMessage="Patchnotes" />}
                    visible={this.state.patchNotesOpen}
                    onCancel={this.closePatchNotes}
                    footer={null}
                >
                    <PatchNotesModal />
                </Modal>
            </div>
        </div>
    }

    openPatchNotes = () => {
        this.setState({patchNotesOpen: true});
    }

    closePatchNotes = () =>  {
        this.setState({patchNotesOpen: false});
    }
}

export default About;