// Функция маппинга данных
import {loadAvatar} from "../../utils/create.utils";

const mapBackendToMock = (backendData: any[]) => {
    return backendData.map((item) => ({
        id: item.id,
        image: item?.avatar ? loadAvatar(item?.avatar) : loadAvatar(),
        name: item?.name,
        surname: item?.last_name,
        middleName:item?.middle_name ?? '',
        role: item?.position?.name || 'Без должности',
        originalData: item
    }));
};

export default mapBackendToMock;