import { Dimensions, PixelRatio, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import Navbar from '../../component/navbar/navbar'
const Fs = Dimensions.get('window').width*0.8
const ht = Dimensions.get('window').height*0.8

export class ServiceInfo extends Component<any,any> {
    constructor(props: {}){
        super(props)
        this.state={
            need:false
        }
    }
  render() {
    return (
        <View style={{flex: 1}}>
            <View style={{position: 'absolute',top: 0,width: "100%",height: "100%",backgroundColor: '#fff'}}>
            </View>
            <SafeAreaView style={{flex: 1}}>
                {/* 引入自定义导航栏 */}
                <Navbar
                    pageName={'《TLINK物联网平台服务条款》'}
                    showBack={true}
                    showHome={false}
                    props={this.props}
                ></Navbar>
                <View style={styles.box}>
                    <ScrollView style={styles.container}>
                        <Text allowFontScaling={false} style={[styles.title1,{textAlign:'center',lineHeight: 25,}]}>电力能耗管理物联网开放平台服务条款（暂行）</Text>
                        <Text allowFontScaling={false} style={styles.title1}>重要提示</Text>
                        <View>
                        <Text allowFontScaling={false}> &emsp;&emsp;深圳市模拟科技有限公司依据本服务协议（以下统称：本条款）为开发者/用户提供电力能耗管理物联网开放平台服务（以下统称：物联网开放平台），本条款在开发者/用户和深圳市模拟科技有限公司之间均具有合同上的法律效力。深圳市模拟科技有限公司在此特别提醒开发者/用户认真阅读、充分理解本条款各细则，特别是其中所涉及的免除、限制深圳市模拟科技有限公司责任的条款、对开发者/用户权利限制条款、争议解决和法律适用等。请审慎阅读并选择接受或不接受本条款。除非开发者/用户接受本条款所有条款，否则开发者/用户无权使用深圳市模拟科技有限公司于本条款下所提供的服务。开发者/用户一经注册或使用本条款下任何服务即视为对本服务条款的充分理解和完全接受。开发者/用户违反本条款时深圳市模拟科技有限公司有权依照其违反情况，限制或停止向开发者/用户提供物联网开放平台服务，并有权追究开发者/用户的相关责任。 </Text>
                            <Text allowFontScaling={false}>&emsp;&emsp;本条款可由深圳市模拟科技有限公司随时更新，更新后的协议及规则条款一旦公布即代替原来的条款，恕不再另行通知。在深圳市模拟科技有限公司修改协议或规则条款后，如果开发者/用户不接受修改后的条款，请立即停止使用对应的服务，开发者/用户继续使用物联网开放平台服务将被视为已接受了修改后的条款。 </Text>
                        </View>
                        <View>
                            <Text allowFontScaling={false} style={styles.title2}>&ensp;定义</Text>
                            <Text allowFontScaling={false}>&emsp;&emsp;如无特别说明，下列术语在本条款中的含义为：</Text>
                            <View>
                                <Text allowFontScaling={false}>
                                    &emsp;&emsp;&emsp;● 1.1 开发者，指经有效注册并通过认证，将其或其公司企业生产的硬件设备，或开发的软件应用接入并使用物联网开放平台对其产品进行远程控制、监控等操作，具备民事行为能力的个人、法人或组织。
                                </Text>
                                <Text allowFontScaling={false}>
                                    &emsp;&emsp;&emsp;● 1.2 用户，指使用开发者接入物联网开放平台的硬件设备使用者、软件应用使用者。
                                </Text>
                                <Text allowFontScaling={false}>
                                    &emsp;&emsp;&emsp;● 1.3 数据，指开发者手动上传，或通过传感器自动上传的数据。
                                </Text>
                            </View>
                        </View>

                        <Text allowFontScaling={false} style={styles.title1}>开发者/用户的权利和义务</Text>
                        <View>
                            <Text allowFontScaling={false} style={styles.title2} > &ensp;2.1 注册认证</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;开发者使用物联网开放平台需要登录开发者账号。通过公测申请获得账号的开发者，务必及时登录修改密码和更新个人信息。如果由于开发者未及时修改密码造成损失的，由开发者单方承担。通过注册获得账号的开发者，务必保证注册信息真实、准确和完整，并在资料变更时及时更新相关信息。对于任何信息不实所导致开发者本人或用户的损害，深圳市模拟科技有限公司不承担任何责任。开发者应妥善保管个人注册信息及登录密码等资料，并对以其注册用户名进行的所有活动和时间负法律责任。</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;用户可以自行设置账户的用户名。用户提交的注册信息、设置的账户用户名、头像和简介等信息应当符合法律法规规定，不得违反法律法规规定、侵犯或涉嫌侵犯他人合法权益。如果用户设置的账户用户名、头像和简介等信息涉嫌违反法律规定，物联网开放平台有权终止提供本网站的所有服务，注销用户的账户。</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;用户禁止制作、发布、复制、传播违法信息，用户应按照国家有关法律法规，遵守法律法规、社会主义制度、国家利益、公民合法权益、公共秩序、社会道德风尚和信息真实性等七条底线。</Text>
                        </View>

                        <View>
                            <Text allowFontScaling={false} style={styles.title2} > &ensp;2.2 接入产品所有权和使用权</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;开发者在使用物联网开放平台时，必须对其接入的硬件设备，或软件应用具备法律上的所有权或使用权。经审核若开发者存在窃用第三方产品的，深圳市模拟科技有限公司将有权取消开发者继续使用物联网开放平台接入服务，终止本条款，并保留追究开发者法律责任的权利。若造成开发者本人或用户损害、纠纷的，深圳市模拟科技有限公司不承担任何责任。若造成物联网开放平台名誉及实质损害的，深圳市模拟科技有限公司将保留追究开发者法律责任的权利。</Text>
                        </View>

                        <View>
                            <Text allowFontScaling={false} style={styles.title2} > &ensp;2.3 正确使用集成过程</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;开发者使用物联网开放平台前务必熟知开发流程，正确使用完成系统集成过程。若因个人操作不当，造成个人或第三方损害的，物联网开放平台不承担任何责任。若然造成物联网开放平台名誉及实质损害的，物联网开放平台将保留追究开发者法律责任的权利。开发者务必合法使用物联网开放平台授予其的服务，不得违反本条款宗旨用于其他目的，不得授予其他单位或个人使用。对开发者因被他人冒用所致损失，物联网开放平台不承担任何责任，并且开发者必须就其一切活动承担全部责任。如因以上过失，对物联网开放平台造成名誉或实质损害的，物联网开放平台将保留追究开发者法律责任。</Text>
                        </View>

                        <View>
                            <Text allowFontScaling={false} style={styles.title2} > &ensp;2.4 基本原则</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;开发者将第三方应用接入物联网开放平台，深圳市模拟科技有限公司不涉足其业务、功能逻辑的实现，和数据、内容审核义务。开发者需要对接入的第三方应用承担一切责任，必须保证以下基本原则：</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（1）不得上传、发布、传播、存储违反宪法、国家法律法规禁止的，危害国家安全、泄露国家秘密、颠覆国家政权、破坏国家统一的，煽动民族仇恨、破坏民族团结的，宣扬邪教封建迷信、迫害宗教政策的，扰乱社会秩序、破坏社会稳定的内容。</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（2）不得在设备查看等页面宣传与其应用无关的任何其他信息，如广告、非法信息宣传等。也不得发布涉及他人隐私，侵犯他人名誉权、肖像权、商业秘密、知识产权等内容。</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（3）开发者与深圳市模拟科技有限公司不存在聘用/雇佣及其他任何合作关系，开发者无论何时不得明示或者暗示自己为深圳市模拟科技有限公司员工。未经深圳市模拟科技有限公司书面许可，开发者不得模仿和使用深圳市模拟科技有限公司或物联网开放平台任何商业标识或近似的产品标识，也不得公开表达或暗示双方存在商务关系，或声称深圳市模拟科技有限公司对开发者的认可。对于有意无意造成用户混淆的行为，深圳市模拟科技有限公司有权要求开发者修改，暂停或终止服务，并保留追究其法律责任的权利。</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（4）开发者拥有依照本条款约定合法使用物联网开放平台开放AviewI 的权利，但不得向任何单位或个人出售转让或转授权物联网开放平台的代码、AviewI 及开发工具等。也不得通过包括但不限于赠送、发售等方式使用于和深圳市模拟科技有限公司有直接竞争关系的公司的产品或品牌服务等，如因开发者违反此条款给用户或深圳市模拟科技有限公司造成任何损失的，开发者应当赔偿损失，并承担相应的法律责任。</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（5）开发者同意接收来自深圳市模拟科技有限公司发出的邮件、信息，包括但不限于关于用户利益、商业推广的信息等；开发者如需向深圳市模拟科技有限公司进行通知，应当通过深圳市模拟科技有限公司对外正式公布的通信地址、电子邮件地址等联系信息送达。</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（6）开发者应对其产品的设计、开发、测试、维护、生产等工序负责，并承担应有的成本。如需深圳市模拟科技有限公司提供有偿服务，需提交书面申请和详细的需求文档，依照双方另外签订的协议执行。</Text>   
                        </View>

                        <Text allowFontScaling={false} style={styles.title1}>深圳市模拟科技有限公司的权利和义务</Text>
                        <View>
                            <Text allowFontScaling={false} >&emsp;&emsp;3.1 深圳市模拟科技有限公司对接入或即将接入物联网开放平台的开发者提供详尽的系统解说义务。包括但不仅限于，系统的功能与使用，系统免费与付费模块等。同时为开发者提供有效及时的咨询服务和可行的技术支持。</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;3.2 深圳市模拟科技有限公司通过官网、微信公众号等方式，向开发者提供线上线下的服务及支持，包括且不限于官网文档中心、多渠道线上技术支持、线下开放实验室等。</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;3.3 深圳市模拟科技有限公司有权审查开发者是否具备合法的接入物联网开放平台的资格，上传的数据是否合法。</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp; 3.4 深圳市模拟科技有限公司拥有合作过程中涉及到的物联网开放平台的所有服务内容知识产权，以及品牌、知识产权在合作过程中所产生的衍生品的全部合法权益。</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;3.5 开发者因违反相关法律法规而被取缔运营，或因违规操作被网络监管部门查封所引发的全部责任，由开发者独立承担。情节严重并给深圳市模拟科技有限公司带来不利影响的，开发者须赔偿深圳市模拟科技有限公司所有损失，并恢复物联网开放平台声誉，此情况下深圳市模拟科技有限公司有权单方终止本条款。</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;3.6 如发现开发者有违法行为，或其上传的用户数据中包含违法信息或可能侵犯他人合法权益的信息，无论是否已造成不良后果，深圳市模拟科技有限公司均有权要求开发者立即停止违法行为或更换、修改违法内容，或者单方终止本服务协议，并且有权要求开发者赔偿由此给深圳市模拟科技有限公司造成的损失。</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;3.7 如发生下列任一情形，深圳市模拟科技有限公司有权以普通或非专业人员的知识水平标准对相关内容进行判别，如认为这些内容或行为具有不合理或违法的情形，深圳市模拟科技有限公司有权删除相关信息，或终止或暂停对该开发者提供服务。</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（1）其他第三方对某个开发者或具体事项持有异议并书面通知深圳市模拟科技有限公司；</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（2）其他第三方向深圳市模拟科技有限公司书面告知物联网开放平台上有违法或不当情形的。</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;3.8深圳市模拟科技有限公司可将本条款下的权利和义务的部分或全部转让给他人，如果开发者不同意深圳市模拟科技有限公司的该转让，则有权停止使用本条款下服务。如果开发者和平台用户继续使用，则视为开发者和平台用户对此转让予以接受。</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;3.9开发者违反平台使用规则时，深圳市模拟科技有限公司有权依照深圳市模拟科技有限公司的认识判断决定并采取以下行动，终止与开发者的服务协议关系，以及其他认为适合的处理方式。</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;3.10深圳市模拟科技有限公司可通过网页公告、电子邮件、手机短信或常规的信件传送等方式向开发者发出通知，通知在发送时即视为已送达收件人</Text>  
                        </View>

                        <Text allowFontScaling={false} style={styles.title1}>知识产权条款</Text>
                        <View>
                            <Text allowFontScaling={false} >&emsp;&emsp;4.1 物联网开放平台上所有内容，均由深圳市模拟科技有限公司或其他权利人依法拥有其知识产权，包括但不限于商标权、专利权、著作权、商业秘密等。非经深圳市模拟科技有限公司或其他权利人书面同意任何人不得擅自使用、修改、复制、公开传播、改变、散布、发行或公开发表物联网开放平台上的内容。</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;4.2 开发者应在其数据服务中向相关权利人提供知识产权投诉途径，确保权利人可以向开发者主张权利。</Text>
                        </View>

                        <Text allowFontScaling={false} style={styles.title1}>隐私相关条款</Text>
                        <View>
                            <Text allowFontScaling={false} >&emsp;&emsp; 5.1 深圳市模拟科技有限公司重视对开发者及平台用户隐私的保护，保护隐私是深圳市模拟科技有限公司的一项基本政策。如发生下列任一情况，深圳市模拟科技有限公司有权对开发者的信息予以披露：</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（1）经开发者本人同意披露的；</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（2）根据法律的有关规定，应相关第三人、行政机构或司法机构的要求，需要向其披露的；</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（3）开发者出现违反中国有关法律、法规、规章、政策的情形，需要向他人披露的；</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（4） 深圳市模拟科技有限公司基于为开发者和平台用户服务的目的而认为合适披露的其他情形</Text> 
                        </View>

                        <Text allowFontScaling={false} style={styles.title1}>服务暂停或终止</Text>
                        <View>
                            <Text allowFontScaling={false} >&emsp;&emsp;6.1 开发者应确保自身在注册时填写的姓名（名称）、地址、电子邮箱等相关资料真实、准确，若有更新的，开发者应在三个工作日内予以更新，如深圳市模拟科技有限公司发现其不真实或不准确的，深圳市模拟科技有限公司有权暂停或终止向其提供本条款下服务由此产生的一切法律责任由开发者自行承担。</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp; 6.2 如开发者书面通知深圳市模拟科技有限公司不接受经深圳市模拟科技有限公司修改的新的服务协议的，深圳市模拟科技有限公司有权随时暂停或终止向其提供本条款下服务。</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;6.3 本条款约定的其他协议终止条件发生或实现的，深圳市模拟科技有限公司有权随时暂停或终止向开发者提供本条款下服务。</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;6.4 在开发者违反本条款规定时，深圳市模拟科技有限公司有权随时暂停或终止向该开发者提供部分或全部开放平台服务。如该开发者后续再直接或间接或以他人名义注册并登录物联网开放平台的，深圳市模拟科技有限公司有权直接单方面暂停或终止提供本条款下服务。</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;6.5 在合作期限内，因不可抗力因素导致授权程序无法继续运营的，双方可协商终止协议。</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;6.6 如本条款服务终止，深圳市模拟科技有限公司有权保留或删除开发者账号中的任何信息，且有权拒绝将该信息发还给开发者，也有权保存或删除开发者的全部相关数据，包括服务终止前开发者尚未完成的任何数据。</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;6.7 在开发者存在违反法律法规或国家相关政策规定时，深圳市模拟科技有限公司有权随时暂停或终止向该开发者提供部分或全部开放平台服务。如该开发者后续再直接或间接（如以他人名义）注册并登录物联网开放平台的，深圳市模拟科技有限公司有权直接单方面暂停或终止提供本条款下服务。</Text>  
                        </View>

                        <Text allowFontScaling={false} style={styles.title1}>协议内容修改</Text>
                        <View>
                            <Text allowFontScaling={false} >&emsp;&emsp; 7.1 本条款内容包括协议正文及所有深圳市模拟科技有限公司已经发布的或将来可能发布的物联网开放平台相关规则。上述规则为本条款不可分割的一部分，与本条款正文具有同等法律效力。</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;7.2 深圳市模拟科技有限公司有权根据需要不时地制订、修改本条款或各类规则，且毋须另行通知。其一旦发生变动，深圳市模拟科技有限公司将会在相关页面上公布修改后的协议或规则，如果开发者不同意所改动的内容，应主动取消服务，如果继续使用服务，则视为接受协议或规则的变动。除另行明确声明外，任何使服务范围扩大或功能增强的新内容均受本条款约束。</Text>
                        </View>
                        <Text allowFontScaling={false} style={styles.title1}>免责事由</Text>
                        <View>
                            <Text allowFontScaling={false} >&emsp;&emsp;8.1 鉴于网络服务的特殊性，开发者同意深圳市模拟科技有限公司会变更、中断部分或全部的网络服务，并按本条款规定删除开发者在使用服务中提交的任何资料，而无需通知开发者，也无需承担任何责任。</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;8.2 深圳市模拟科技有限公司有权定期或不定期地对提供网络服务的平台或相关的设备进行检修或者维护，如因此类情况而造成网络服务在一定时间内的中断或暂停，深圳市模拟科技有限公司无需为此承担任何责任。</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;8.3 如发生下述任一情况而导致服务中断及开发者损失的，深圳市模拟科技有限公司不承担责任：</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（1）发生不可抗力情形的；</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（2）黑客攻击、计算机病毒侵入或发作的；</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（3）计算机系统遭到破坏、瘫痪或无法正常使用的；</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（4）电信部门技术调整的；</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（5）因政府管制而造成暂时性关闭的；</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;（6）其它非因深圳市模拟科技有限公司的过错而引起的。</Text>   
                        </View>

                        <Text allowFontScaling={false} style={styles.title1}>本条款的解释、法律适用及争端解决</Text>
                        <View>
                            <Text allowFontScaling={false} >&emsp;&emsp;9.1 深圳市模拟科技有限公司对本条款拥有最终解释权。</Text>
                            <Text allowFontScaling={false} >&emsp;&emsp;9.2 本条款的有效性、履行和与本条款及其修订本效力有关的所有事宜，将受中华人民共和国大陆法律管辖，任何争议仅适用中华人民共和国大陆法律。</Text>
                        </View>
                        { this.state.need ?
                            <View>
                                <Text allowFontScaling={false} style={styles.deny} >不接受</Text>
                                <Text allowFontScaling={false} style={styles.accept}>同意并接受</Text>
                            </View>:''
                        }
                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    )
  }
}
const styles = StyleSheet.create({
    box:{
        width: '100%',
        display:'flex',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    container:{
        position: 'relative',
        width: '90%',
        height: Dimensions.get('window').height-ht/6,
    },
    title1:{
        color: '#333',
        fontWeight: '700',
        fontSize: Fs/20,
        marginTop: 10,
        marginBottom: 10,
    },
    text:{
        height: 25,
    },
    title2:{
        color: '#333',
        fontWeight: '700',
        fontSize: Fs/22 ,
        marginTop: 7,
        marginBottom: 7,
    },
    
    floor :{
      paddingTop: 15,
      paddingBottom:15,
      paddingRight: 10,
      paddingLeft: 10,
      display: 'flex',
      alignItems: 'center',
    },
    deny:{
      fontSize: Fs/20,
      width: 120,
    },
    accept:{
        width: 120,
        height: 40,
        lineHeight: 40,
        textAlign: 'center',
        fontSize: Fs/22,
        color: '#fff',
        backgroundColor: '#2EA4FF',
        borderRadius: 5,
        padding: 0,
        verticalAlign: 'middle',
    },
})
export default ServiceInfo