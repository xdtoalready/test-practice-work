import React, { useState } from 'react';
import Card from '../../../../../../shared/Card';
import Button from '../../../../../../shared/Button';
import styles from './ContractCard.module.sass';
import ContractModal from '../ContractModal';
import ConfirmationModal from '../../../../../../components/ConfirmationModal';
import useContractsApi from '../../../../api/contracts.api';
import useServiceApi from '../../../../services.api';

const ContractCard = ({ contract, serviceId, clientLegalType }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const contractsApi = useContractsApi();
  const serviceApi = useServiceApi();

  const handleCreateSuccess = () => {
    serviceApi.getServiceById(serviceId, true);
  };

  const handleEditSuccess = () => {
    serviceApi.getServiceById(serviceId, true);
  };

  const handleDelete = async () => {
    try {
      await contractsApi.deleteContract(contract.id);
      serviceApi.getServiceById(serviceId, true);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting contract:', error);
    }
  };

  const handleView = () => {
    contractsApi.viewContractPdf(contract.id);
  };

  const handleDownload = () => {
    contractsApi.downloadContractPdf(contract.id);
  };

  return (
    <>
      <Card
        title={'Договор'}
        classTitle={styles.title}
        className={styles.card}
      >
        {!contract ? (
          <div className={styles.emptyState}>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              type={'primary'}
              name={'Создать договор'}
              classname={styles.createButton}
            />
          </div>
        ) : (
          <div className={styles.contractInfo}>
            <div className={styles.contractTitle}>
              {contract.title || `Договор №${contract.number}`}
            </div>
            <div className={styles.actions}>
              <Button
                onClick={handleView}
                type={'secondary'}
                name={'Просмотр'}
                classname={styles.actionButton}
              />
              <Button
                onClick={handleDownload}
                type={'secondary'}
                name={'Скачать'}
                classname={styles.actionButton}
              />
              <Button
                onClick={() => setIsEditModalOpen(true)}
                type={'secondary'}
                name={'Редактировать'}
                classname={styles.actionButton}
              />
              <Button
                onClick={() => setIsDeleteModalOpen(true)}
                type={'secondary'}
                name={'Удалить'}
                classname={styles.deleteButton}
              />
            </div>
          </div>
        )}
      </Card>

      {isCreateModalOpen && (
        <ContractModal
          serviceId={serviceId}
          clientLegalType={clientLegalType}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
          isEdit={false}
        />
      )}

      {isEditModalOpen && (
        <ContractModal
          contract={contract}
          serviceId={serviceId}
          clientLegalType={clientLegalType}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleEditSuccess}
          isEdit={true}
        />
      )}

      {isDeleteModalOpen && (
        <ConfirmationModal
          label={'Вы действительно хотите удалить договор?'}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default ContractCard;
