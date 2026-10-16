import { hp } from 'src/utils/cssPrefix';

/** Local stand-in for ui/Loader. */
const Loader = ({ label = 'Loading' }: { label?: string }) => {
  return (
    <div className={hp('flex items-center justify-center gap-3 py-10')} role='status'>
      <span
        className={hp(
          'inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#92722A] border-t-transparent',
        )}
      />
      <span className={hp('text-[#8D8E90]')}>{label}</span>
    </div>
  );
};

export default Loader;
