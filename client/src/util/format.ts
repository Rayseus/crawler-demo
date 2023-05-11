interface MessageType {
    [key: string]: string
}

const fotmatMessage: MessageType = {
    'getLiveRoomData': '直播数据',
    'getLivingData': '正在直播数据',
    'line_online_count': '直播中的抖音号',
    'promotion_count': '推广中的抖音号',
    'cumulative_views_count': '累计观看数',
    'avg_views_count': '场均观看数',
    'list': '正在直播'
}

export default fotmatMessage;