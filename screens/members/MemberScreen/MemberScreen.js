import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useWix, useWixModules} from "@wix/sdk-react";
import {members} from "@wix/members";
import {useWixSession} from "../../../authentication/session";
import {Image, ScrollView, Text, TextInput, View} from "react-native";
import {styles} from "../../../styles/members/styles";
import {Button, Divider, IconButton, List, Menu} from "react-native-paper";
import {useState} from "react";
import {useMemberHandler} from "../../../authentication/MemberHandler";
import {LoadingIndicator} from "../../../components/LoadingIndicator/LoadingIndicator";
import {ErrorView} from "../../../components/ErrorView/ErrorView";
import {format} from "date-fns";
import getSymbolFromCurrency from 'currency-symbol-map'

const FormInput = ({labelValue, placeholderText, inputValue, ...rest}) => {
    return (
        <View
            style={styles.accountInputContainer}>
            <Text style={styles.accountInfoText}>
                {labelValue}:
            </Text>
            <TextInput style={styles.accountInput} placeholder={placeholderText} {...rest} value={inputValue}/>
        </View>
    )
}

const MemberForm = () => {
    const {firstName, lastName, phone, updateContact} = useMemberHandler();

    return (
        <View style={styles.accountInfo}>
            <Text style={styles.accountInfoTitle}>
                Account
            </Text>
            <Text style={styles.accountInfoSubtitle}>
                Update your personal information.
            </Text>
            <Text style={styles.accountInfoText}>
                Login Email:
            </Text>
            <Text style={styles.accountInfoText}>
                'demo@email'
            </Text>
            <Text style={styles.accountInfoSmallText}>
                Your Login email can't be changed.
            </Text>
            <FormInput inputValue={firstName} labelValue={'First Name'}
                       placeholderText={'First Name'}
                       onChangeText={(text) => updateContact({firstName: text, lastName, phone})}/>
            <FormInput inputValue={lastName} labelValue={'Last Name'}
                       placeholderText={'Last Name'}
                       onChangeText={(text) => updateContact({lastName: text, firstName, phone})}/>
            <FormInput inputValue={phone} labelValue={'Phone'} placeholderText={'Phone'}
                       onChangeText={(text) => updateContact({phone: text, firstName, lastName})}
                       keyboardType={'phone-pad'}/>
        </View>
    );
}

const Orders = () => {
    const wix = useWix();
    const {session} = useWixSession();

    const myOrdersQuery = useQuery(["my-orders", session], async () => {
        const res = await wix.fetch(`/stores/v2/orders/query`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: {},
            }),
        });
        return res.json();
    });

    if (myOrdersQuery.isLoading) {
        return <LoadingIndicator/>;
    }

    if (myOrdersQuery.isError) {
        return <ErrorView message={myOrdersQuery.error.message}/>;
    }

    return (
        <List.Accordion title={'My Orders'}
                        style={styles.membersOrders}
                        titleStyle={{
                            fontSize: 20,
                            color: '#403f2b',
                        }}
                        right={(props) => <List.Icon {...props}
                                                     icon={`chevron-${props.isExpanded ? 'up' : 'down'}`}
                                                     color={'#403f2b'}
                                                     style={styles.ordersShowMoreIcon}
                        />}
        >
            {myOrdersQuery.data.orders.map((order) => {
                return (
                    <View key={order.id}>
                        <List.Item
                            key={order.id}
                            contentStyle={{
                                flexGrow: 1,
                                width: '100%',
                            }}
                            title={`Order number #${order.number}`}
                            description={
                                <View>
                                    <Text/>
                                    <Text>
                                        Date: {format(new Date(order.dateCreated), "MMM dd, yyyy")}
                                    </Text>
                                    <Text>
                                        Status:{" "}
                                        {
                                            {
                                                FULFILLED: "Fulfilled",
                                                NOT_FULFILLED: "Not Fulfilled",
                                                PARTIALLY_FULFILLED: "Partially Fulfilled",
                                                CANCELLED: "Cancelled",
                                            }[order.fulfillmentStatus]
                                        }
                                    </Text>
                                    <Text>
                                        Payment Status:
                                        {
                                            {
                                                PAID: "Paid",
                                                NOT_PAID: "Not Paid",
                                                PARTIALLY_PAID: "Partially Paid",
                                                REFUNDED: "Refunded",
                                            }[order.paymentStatus]
                                        }
                                    </Text>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        backgroundColor: '#fdfbef'
                                    }}>
                                        <List.Accordion title={'Items'}
                                                        style={{
                                                            backgroundColor: '#fdfbef',
                                                        }}
                                                        titleStyle={{
                                                            marginHorizontal: -15,
                                                            paddingRight: 10,
                                                        }}
                                                        descriptionStyle={{
                                                            padding: 0,
                                                            marginHorizontal: -15,
                                                            marginVertical: 50,
                                                        }}
                                                        theme={{
                                                            colors: {
                                                                primary: '#403f2b',
                                                                text: '#403f2b',
                                                            }
                                                        }}
                                        >
                                            {order.lineItems.map((item, index) => (
                                                <List.Item key={item.id + index}
                                                           title={`${item.name}`}
                                                           description={
                                                               <View style={{
                                                                   flexDirection: 'row',
                                                                   justifyContent: 'space-between',
                                                               }}>
                                                                   <View>
                                                                       <Image
                                                                           source={{
                                                                               uri: item.mediaItem?.url ??
                                                                                   `https://via.placeholder.com/50`
                                                                           }}
                                                                           style={{
                                                                               width: 50,
                                                                               height: 50,
                                                                           }}/>
                                                                   </View>
                                                                   <View style={{padding: 10}}>
                                                                       <Text>
                                                                           Quantity: {item.quantity}
                                                                       </Text>
                                                                       <Text>
                                                                           Price: {getSymbolFromCurrency(order.currency)}{item.totalPrice}
                                                                       </Text>
                                                                   </View>
                                                               </View>
                                                           }
                                                />
                                            ))}
                                        </List.Accordion>
                                    </View>
                                    <Text/>
                                    <Text>Total: {getSymbolFromCurrency(order.currency)}{order.totals.total}</Text>
                                </View>
                            }/>
                        <Divider/>
                    </View>
                );
            })}
            {/*{orders.map((order, index) => (*/}
            {/*    <List.Item key={index} title={order.title} description={order.description}/>*/}
            {/*))}*/}
            {!myOrdersQuery.data.orders.length && <Text style={styles.orderDetails}>
                You have no orders yet.
            </Text>}
        </List.Accordion>
    );

}
export const MemberScreen = ({member}) => {
    const queryClient = useQueryClient();
    const {updateMember} = useWixModules(members);
    const {newVisitorSession} = useWixSession();
    const {firstName, lastName, phone, updateContact} = useMemberHandler();
    const [currentMember, setCurrentMember] = useState(member);
    const [visibleMenu, setVisibleMenu] = useState(false);
    const updateMemberMutation = useMutation(
        async () => {
            if (!currentMember) return;
            const contact = currentMember?.contact;
            const updatedContact = {
                ...(contact || {}),
                firstName,
                lastName,
                phones: [...(contact?.phones || []), phone],
            };
            const updatedMember = {
                contact: updatedContact,
            }
            return await updateMember(
                currentMember?._id,
                updatedMember,
            );
        },
        {
            onSuccess: async (response) => {
                setCurrentMember(response);
                queryClient.setQueryData(["currentMember"], response);
            },
        }
    );

    const {profile, contact} = currentMember || {};

    return (
        <ScrollView style={styles.contentSection}
                    keyboardShouldPersistTaps="always"
                    alwaysBounceVertical={false}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
        >
            <View style={styles.memberHeader}/>
            <View style={styles.memberSection}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                }}>
                    <Image
                        style={styles.memberImage}
                        source={{
                            uri: profile?.photo?.url ??
                                `https://ui-avatars.com/api/?background=random&name=
                             ${contact?.firstName && contact?.lastName ?
                                    `${contact?.firstName} ${contact?.lastName}` : profile?.nickname}
                              &color=fff&size=100&font-size=0.33&length=1&rounded=true&uppercase=true`
                        }}
                    />
                    <Menu
                        visible={visibleMenu}
                        onDismiss={() => setVisibleMenu(false)}
                        anchor={
                            <IconButton icon={'dots-vertical'}
                                        iconColor={'#403f2b'}
                                        size={30}
                                        onPress={() => setVisibleMenu(!visibleMenu)}
                                        style={{backgroundColor: '#fdfbef'}}
                            />
                        }
                        contentStyle={{backgroundColor: '#fdfbef', padding: 10, marginTop: 40}}
                        theme={{colors: {text: '#403f2b'}}}
                    >
                        <Menu.Item leadingIcon="logout" onPress={async () => {
                            await newVisitorSession();
                            navigation.navigate("Home");
                        }} title="Signout"/>
                    </Menu>
                </View>
                <Text style={{
                    fontSize: 20,
                    marginTop: 20,
                    color: '#403f2b'
                }}>
                    {contact?.firstName && contact?.lastName ?
                        `${contact?.firstName} ${contact?.lastName}` : profile?.nickname}
                </Text>
            </View>
            <View style={{marginTop: 20, width: '100%'}}>
                <Orders/>
            </View>
            <View style={styles.memberDetails}>
                <Text style={styles.memberDetailsTitle}>
                    My Account
                </Text>
                <Text style={styles.memberDetailsSubTitle}>
                    View and edit your personal info below.
                </Text>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: 10,
                    width: '100%',
                    marginTop: 20,
                }}>
                    <Button
                        mode="outlined"
                        onPress={() => {
                            updateContact({
                                firstName: contact?.firstName,
                                lastName: contact?.lastName,
                                phone: contact?.phones[0]
                            });
                        }}
                        style={styles.memberActionButton}
                        labelStyle={{fontFamily: 'Fraunces-Regular', fontSize: 16}}
                        theme={{colors: {primary: '#403f2b'}}}
                    >
                        Discard
                    </Button>
                    <Button
                        mode="contained"
                        onPress={() => {
                            updateMemberMutation.mutate();
                        }} style={styles.memberActionButton}
                        labelStyle={{fontFamily: 'Fraunces-Regular', fontSize: 16}}
                        theme={{colors: {primary: '#403f2b'}, fonts: {fontFamily: 'Fraunces-Regular'}}}
                    >
                        Update Info
                    </Button>
                </View>
                <MemberForm/>
            </View>
        </ScrollView>
    );
}