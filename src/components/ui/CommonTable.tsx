import { ConfigProvider, Table, TableProps } from 'antd';
import Loader from './Loader';

type CustomProps = TableProps & {
  isLoading?: boolean;
};

/**
 * Local stand-in for ui/CommonTable: antd Table with the same gold theme
 * tokens the shared component applies.
 */
const CommonTable = ({ columns, dataSource, isLoading = false, ...rest }: CustomProps) => {
  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: '#cba344', colorBorder: '#cba344' },
        components: {
          Table: {
            headerBg: 'rgba(182, 138, 53, 0.15)',
          },
        },
      }}
    >
      <Table
        columns={columns}
        loading={{
          indicator: (
            <div className='w-full h-[30rem] flex justify-center items-center'>
              <Loader />
            </div>
          ),
          spinning: isLoading,
        }}
        dataSource={dataSource}
        {...rest}
      />
    </ConfigProvider>
  );
};

export default CommonTable;
