import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from 'antd';
import { MagnifyingGlass, Plus } from '@phosphor-icons/react';
import { hp } from 'src/utils/cssPrefix';
import Button from 'src/components/ui/Button';
import CommonTable from 'src/components/ui/CommonTable';
import InputText from 'src/components/ui/InputText';
import AntSelect from 'src/components/ui/AntSelect';
import Status from 'src/components/ui/Status';
import SectionHeader from 'src/components/SectionHeader';
import { szhpService } from 'src/services/szhpService';
import { APPLICATION_STATUS_LABEL, STATUS_FILTER_OPTIONS } from 'src/constants/housing';
import type { IHousingApplicationSummary } from 'src/types/housing';
import { asText, formatAED, formatDate } from 'src/utils/format';

const PAGE_SIZE = 10;

const HousingApplicationsList = () => {
  const navigate = useNavigate();

  const [rows, setRows] = useState<IHousingApplicationSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [status, setStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [applied, setApplied] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await szhpService.getHousingApplications({
        status: status === 'ALL' ? undefined : status,
        search: applied || undefined,
        pageNo,
        pageSize: PAGE_SIZE,
      });
      setRows(result?.data ?? []);
      setTotal(result?.totalCount ?? 0);
    } catch {
      setError('The applications could not be loaded. Check that the housing service is running.');
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [status, applied, pageNo]);

  useEffect(() => {
    void load();
  }, [load]);

  const columns = [
    {
      title: 'Application No',
      dataIndex: 'applicationNumber',
      key: 'applicationNumber',
      render: (_: unknown, row: IHousingApplicationSummary) => (
        <Link
          className={hp('text-primary-600 font-semibold')}
          to={`/housing-requests/${row.applicationId}`}
        >
          {asText(row.applicationNumber ?? row.applicationId)}
        </Link>
      ),
    },
    {
      title: 'Reference No',
      dataIndex: 'referenceNo',
      key: 'referenceNo',
      render: (value: string) => asText(value),
    },
    {
      title: 'Applicant',
      dataIndex: 'applicantNameEn',
      key: 'applicantNameEn',
      render: (_: unknown, row: IHousingApplicationSummary) => (
        <div>
          <div className={hp('text-[#323438] font-medium')}>{asText(row.applicantNameEn)}</div>
          <div className={hp('text-[#8D8E90] text-sm')}>{asText(row.emiratesId)}</div>
        </div>
      ),
    },
    {
      title: 'Assistance Type',
      dataIndex: 'assistanceType',
      key: 'assistanceType',
      render: (value: string) => asText(value),
    },
    {
      title: 'Region',
      dataIndex: 'regionEn',
      key: 'regionEn',
      render: (_: unknown, row: IHousingApplicationSummary) => asText(row.regionEn ?? row.region),
    },
    {
      title: 'Awarded Amount',
      dataIndex: 'awardedAidAmount',
      key: 'awardedAidAmount',
      align: 'right' as const,
      render: (value: string) => formatAED(value),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_: unknown, row: IHousingApplicationSummary) => {
        const code = row.processStatus ?? row.status ?? '';
        return <Status labelKey={code} label={APPLICATION_STATUS_LABEL[code] ?? code} />;
      },
    },
    {
      title: 'Created',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (value: string) => formatDate(value),
    },
    {
      title: '',
      key: 'actions',
      render: (_: unknown, row: IHousingApplicationSummary) => (
        <Button
          styleVariant='outline'
          sizeVariant='xs'
          onClick={() => navigate(`/housing-requests/${row.applicationId}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className={hp('outlet-root')}>
      <div className={hp('flex flex-wrap items-center justify-between gap-4 mb-6')}>
        <div>
          <h1 className={hp('text-2xl font-bold text-[#323438]')}>
            My Housing Assistance Requests
          </h1>
          <p className={hp('text-[#8D8E90] mb-0')}>
            Track your requests and continue any drafts.
          </p>
        </div>
        <Link to='/housing-requests/new'>
          <Button>
            <Plus size={18} weight='bold' /> New Request
          </Button>
        </Link>
      </div>

      {error ? (
        <Alert type='error' showIcon message={error} className={hp('mb-4')} />
      ) : null}

      <SectionHeader title='Search' />

      <form
        className={hp('grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-6')}
        onSubmit={(event) => {
          event.preventDefault();
          setPageNo(1);
          setApplied(search);
        }}
      >
        <AntSelect
          id='status'
          name='status'
          label='Status'
          options={STATUS_FILTER_OPTIONS}
          value={status}
          allowClear={false}
          onChange={(value) => {
            setPageNo(1);
            setStatus(String(value));
          }}
        />
        <div className={hp('md:col-span-2')}>
          <InputText
            id='search'
            name='search'
            label='Search'
            value={search}
            placeholder='Application number, reference number or Emirates ID'
            onInputChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className={hp('flex gap-2')}>
          <Button type='submit'>
            <MagnifyingGlass size={18} weight='bold' /> Search
          </Button>
          {(applied || status !== 'ALL') && (
            <Button
              styleVariant='outline'
              type='button'
              onClick={() => {
                setSearch('');
                setApplied('');
                setStatus('ALL');
                setPageNo(1);
              }}
            >
              Clear
            </Button>
          )}
        </div>
      </form>

      <CommonTable
        rowKey={(row) => (row as IHousingApplicationSummary).applicationId ?? ''}
        columns={columns}
        dataSource={rows}
        isLoading={loading}
        scroll={{ x: 1100 }}
        pagination={{
          current: pageNo,
          pageSize: PAGE_SIZE,
          total,
          showSizeChanger: false,
          onChange: (page) => setPageNo(page),
        }}
      />
    </div>
  );
};

export default HousingApplicationsList;
