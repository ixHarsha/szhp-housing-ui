import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Timeline } from 'antd';
import { hp } from 'src/utils/cssPrefix';
import Breadcrumbs from 'src/components/ui/Breadcrumbs';
import Button from 'src/components/ui/Button';
import Loader from 'src/components/ui/Loader';
import Status from 'src/components/ui/Status';
import JobDetails from 'src/components/JobDetails';
import SectionHeader from 'src/components/SectionHeader';
import { szhpService } from 'src/services/szhpService';
import { APPLICATION_STATUS_LABEL, isEditableStatus } from 'src/constants/housing';
import type { IHousingApplicationDetails, IRequestHistory } from 'src/types/housing';
import { asText, formatAED, formatDate, formatDateTime } from 'src/utils/format';

const HousingApplicationDetailsPage = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState<IHousingApplicationDetails | null>(null);
  const [history, setHistory] = useState<IRequestHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!applicationId) return;
    setLoading(true);
    try {
      const [detail, trail] = await Promise.all([
        szhpService.getHousingApplicationById(applicationId),
        szhpService.getRequestHistory(applicationId).catch(() => [] as IRequestHistory[]),
      ]);
      setDetails(detail);
      setHistory(trail);
      setError(null);
    } catch {
      setError('The application could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    void load();
  }, [load]);

  const submit = async () => {
    if (!applicationId) return;
    setBusy(true);
    setError(null);
    try {
      const updated = await szhpService.submitHousingApplication(applicationId);
      setDetails(updated);
      setNotice('The request has been submitted.');
      await load();
    } catch {
      setError('The request could not be submitted.');
    } finally {
      setBusy(false);
    }
  };

  if (loading && !details) {
    return <Loader label='Loading the application' />;
  }

  if (!details) {
    return (
      <div className={hp('outlet-root')}>
        <Alert type='error' showIcon message={error ?? 'Application not found.'} />
        <div className={hp('mt-4')}>
          <Button onClick={() => navigate('/housing-requests')}>Back to requests</Button>
        </div>
      </div>
    );
  }

  const statusCode = details.status ?? details.applicationStatus ?? '';
  const isEditable = isEditableStatus(statusCode);

  return (
    <div className={hp('outlet-root')}>
      <Breadcrumbs
        itemFeed={[
          { label: 'Housing Requests', path: '/housing-requests' },
          { label: asText(details.applicationNumber ?? details.applicationId), path: '' },
        ]}
      />

      {notice ? (
        <Alert
          type='success'
          showIcon
          closable
          message={notice}
          className={hp('mt-4')}
          onClose={() => setNotice(null)}
        />
      ) : null}
      {error ? <Alert type='error' showIcon message={error} className={hp('mt-4')} /> : null}

      <div className={hp('flex flex-wrap items-center justify-between gap-4 mt-4 mb-8')}>
        <div>
          <div className={hp('flex items-center gap-3')}>
            <h1 className={hp('text-2xl font-bold text-[#323438] mb-0')}>
              {asText(details.applicationNumber ?? details.applicationId)}
            </h1>
            <Status labelKey={statusCode} label={APPLICATION_STATUS_LABEL[statusCode] ?? statusCode} />
          </div>
          <p className={hp('text-[#8D8E90] mb-0')}>
            {asText(details.applicant?.fullNameEn)} &middot; {asText(details.assistanceType)}
          </p>
        </div>

        {isEditable ? (
          <div className={hp('flex gap-3')}>
            <Button
              styleVariant='outline'
              onClick={() => navigate(`/housing-requests/${applicationId}/edit`)}
            >
              Edit
            </Button>
            <Button disabled={busy} onClick={() => void submit()}>
              {statusCode === 'RETURNED' ? 'Resubmit' : 'Submit'}
            </Button>
          </div>
        ) : null}
      </div>

      {details.rejectionReason ? (
        <Alert type='error' showIcon message='Rejected' description={details.rejectionReason} className={hp('mb-6')} />
      ) : null}
      {details.returnReason ? (
        <Alert type='warning' showIcon message='Returned for information' description={details.returnReason} className={hp('mb-6')} />
      ) : null}

      <div className={hp('mb-8')}>
        <JobDetails
          header='Social Status'
          details={[
            { title: 'Applicant Name', value: asText(details.applicant?.fullNameEn) },
            { title: 'Emirates ID', value: asText(details.applicant?.emiratesId) },
            { title: 'Mobile Number', value: asText(details.applicant?.mobileNo) },
            { title: 'Email', value: asText(details.applicant?.email) },
            { title: 'Marital Status', value: asText(details.maritalStatus) },
            { title: 'Marriage Date', value: formatDate(details.marriageDate) },
            { title: 'Number of Wives', value: asText(details.noOfWives) },
            { title: 'Number of Children', value: asText(details.noOfChildrens) },
            { title: 'Family Book Emirate', value: asText(details.familyBookEmirate) },
            { title: 'Region', value: asText(details.regionEn ?? details.region) },
          ]}
        />
      </div>

      <div className={hp('mb-8')}>
        <JobDetails
          header='Employment and Income'
          details={[
            { title: 'Employer', value: asText(details.employerDetails?.employerName) },
            { title: 'Designation', value: asText(details.employerDetails?.desigination) },
            { title: 'Sector', value: asText(details.employerDetails?.sector) },
            { title: 'Annual Income', value: formatAED(details.employerDetails?.annualIncome) },
            { title: 'Eligibility', value: asText(details.eligibility) },
          ]}
        />
      </div>

      <div className={hp('mb-8')}>
        <JobDetails
          header='Assistance Request Details'
          details={[
            { title: 'Request Type', value: asText(details.requestType) },
            { title: 'Assistance Type', value: asText(details.assistanceType) },
            { title: 'Assistance Purpose', value: asText(details.assistancePurpose) },
            { title: 'Awarded Aid Type', value: asText(details.awardedAidType) },
            { title: 'Awarded Amount', value: formatAED(details.awardedAidAmount) },
            { title: 'Reference No', value: asText(details.referenceNo) },
            { title: 'Created Date', value: formatDate(details.createdDate) },
            { title: 'Updated Date', value: formatDate(details.updatedDate) },
          ]}
        />
      </div>

      <div className={hp('mb-8')}>
        <JobDetails
          header='Residential Details'
          details={[
            { title: 'Housing Ownership', value: asText(details.housingOwnership) },
            { title: 'Location', value: asText(details.location) },
            { title: 'Years of Staying', value: asText(details.yearsOfStaying) },
            { title: 'Land for Construction', value: asText(details.landForConstruction) },
            { title: 'Construction Area (sq ft)', value: asText(details.constructionAreSqFeet) },
            { title: 'Technical Condition', value: asText(details.technicalConsition) },
            { title: 'Dwelling Year of Construction', value: asText(details.dwellingYOC) },
            { title: 'Number of Occupants', value: asText(details.noOfOccupants) },
            { title: 'Number of Rooms', value: asText(details.noOfRooms) },
            { title: 'Number of Bedrooms', value: asText(details.noOfBedRooms) },
            { title: 'Number of Bathrooms', value: asText(details.noOfBathrooms) },
            { title: 'Number of Majlis', value: asText(details.noOfCouncils) },
            { title: 'Previously Received Aid', value: asText(details.receviedHousingAID) },
          ]}
        />
      </div>

      <SectionHeader title='Request History' />
      {history.length === 0 ? (
        <p className={hp('text-[#8D8E90]')}>No activity recorded yet.</p>
      ) : (
        <Timeline
          className={hp('mt-2')}
          items={history.map((entry) => ({
            color: '#92722A',
            children: (
              <div>
                <div className={hp('flex flex-wrap items-center gap-2')}>
                  <Status
                    labelKey={entry.processStatus ?? entry.status ?? ''}
                    label={
                      APPLICATION_STATUS_LABEL[entry.processStatus ?? entry.status ?? ''] ??
                      asText(entry.processStatus ?? entry.status)
                    }
                  />
                  <span className={hp('text-[#8D8E90] text-sm')}>
                    {asText(entry.taskName)} &middot; {formatDateTime(entry.createdDate)} &middot;{' '}
                    {asText(entry.actedBy)}
                  </span>
                </div>
                {entry.comments ? (
                  <div className={hp('text-[#323438] mt-1')}>{entry.comments}</div>
                ) : null}
              </div>
            ),
          }))}
        />
      )}
    </div>
  );
};

export default HousingApplicationDetailsPage;
