import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Alert } from 'antd';
import { hp } from 'src/utils/cssPrefix';
import Breadcrumbs from 'src/components/ui/Breadcrumbs';
import Button from 'src/components/ui/Button';
import Loader from 'src/components/ui/Loader';
import FormFieldGenerator, { FieldData } from 'src/components/FormFieldGenerator';
import SectionHeader from 'src/components/SectionHeader';
import { szhpService } from 'src/services/szhpService';
import {
  ASSISTANCE_PURPOSE_OPTIONS,
  ASSISTANCE_TYPE_OPTIONS,
  EMIRATE_OPTIONS,
  HOUSING_OWNERSHIP_OPTIONS,
  MARITAL_CATEGORY_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  REQUEST_TYPE_SZHP,
  TECHNICAL_CONDITION_OPTIONS,
} from 'src/constants/housing';
import type { IHousingApplicationDetails } from 'src/types/housing';

/**
 * Field names follow external-form/schema/HousingFormSchema.ts so the payload
 * matches the existing service contract.
 */
const schema = z.object({
  /* social status */
  maritalStatus: z.string().min(1, 'Marital status is required'),
  maritalCategory: z.string().optional(),
  noOfWives: z.string().optional(),
  noOfChildrens: z.string().optional(),
  divorceDate: z.string().nullable().optional(),
  spouseDeathDate: z.string().nullable().optional(),
  employerName: z.string().optional(),
  desigination: z.string().optional(),
  sector: z.string().optional(),
  workCategory: z.string().optional(),
  annualIncome: z.string().optional(),
  startDate: z.string().nullable().optional(),

  /* housing data */
  housingOwnership: z.string().min(1, 'Housing ownership is required'),
  region: z.string().min(1, 'Region is required'),
  familyBookEmirate: z.string().min(1, 'Emirate based on family book is required'),
  location: z.string().optional(),
  leaseRentalDate: z.string().nullable().optional(),

  /* assistance request details */
  landForConstruction: z.string().optional(),
  assistanceType: z.string().min(1, 'Type of assistance is required'),
  assistancePurpose: z.string().min(1, 'Purpose of assistance is required'),
  purposeCategory: z.string().optional(),
  noOfBedRooms: z.string().optional(),

  /* residential details */
  technicalConsition: z.string().optional(),
  dwellingYOC: z.string().optional(),
  constructionAreSqFeet: z.string().optional(),
  yearsOfStaying: z.string().optional(),
  noOfOccupants: z.string().optional(),
  noOfRooms: z.string().optional(),
  noOfCouncils: z.string().optional(),
  noOfBathrooms: z.string().optional(),
  noOfKitchens: z.string().optional(),
  receviedHousingAID: z.boolean().optional(),
  noPrevHousingAsst: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const DEFAULTS: FormValues = {
  maritalStatus: '',
  maritalCategory: '',
  noOfWives: '',
  noOfChildrens: '',
  divorceDate: null,
  spouseDeathDate: null,
  employerName: '',
  desigination: '',
  sector: '',
  workCategory: '',
  annualIncome: '',
  startDate: null,
  housingOwnership: '',
  region: '',
  familyBookEmirate: '',
  location: '',
  leaseRentalDate: null,
  landForConstruction: '',
  assistanceType: '',
  assistancePurpose: '',
  purposeCategory: '',
  noOfBedRooms: '',
  technicalConsition: '',
  dwellingYOC: '',
  constructionAreSqFeet: '',
  yearsOfStaying: '',
  noOfOccupants: '',
  noOfRooms: '',
  noOfCouncils: '',
  noOfBathrooms: '',
  noOfKitchens: '',
  receviedHousingAID: false,
  noPrevHousingAsst: '',
};

const YES_NO = [
  { label: 'Yes', value: 'Y' },
  { label: 'No', value: 'N' },
];

const toPayload = (values: FormValues): IHousingApplicationDetails => ({
  requestType: REQUEST_TYPE_SZHP,
  maritalStatus: values.maritalStatus,
  maritalCategory: values.maritalCategory,
  noOfWives: values.noOfWives ?? '',
  noOfChildrens: values.noOfChildrens ?? '',
  divorceDate: values.divorceDate ?? undefined,
  spouseDeathDate: values.spouseDeathDate ?? undefined,
  region: values.region,
  familyBookEmirate: values.familyBookEmirate,
  housingOwnership: values.housingOwnership,
  location: values.location,
  leaseRentalDate: values.leaseRentalDate ?? undefined,
  landForConstruction: values.landForConstruction,
  assistanceType: values.assistanceType,
  assistancePurpose: values.assistancePurpose,
  purposeCategory: values.purposeCategory,
  noOfBedRooms: values.noOfBedRooms,
  technicalConsition: values.technicalConsition,
  dwellingYOC: values.dwellingYOC,
  constructionAreSqFeet: values.constructionAreSqFeet,
  yearsOfStaying: values.yearsOfStaying,
  noOfOccupants: values.noOfOccupants,
  noOfRooms: values.noOfRooms,
  noOfCouncils: values.noOfCouncils,
  noOfBathrooms: values.noOfBathrooms,
  noOfKitchens: values.noOfKitchens,
  receviedHousingAID: values.receviedHousingAID ? 'Y' : 'N',
  noPrevHousingAsst: values.noPrevHousingAsst,
  employerDetails: {
    employerName: values.employerName,
    desigination: values.desigination,
    sector: values.sector,
    workCategory: values.workCategory,
    annualIncome: values.annualIncome,
    startDate: values.startDate ?? undefined,
  },
});

const HousingAssistanceForm = () => {
  const { applicationId } = useParams();
  const editing = Boolean(applicationId);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const useFormMethods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULTS,
    mode: 'onTouched',
  });

  useEffect(() => {
    if (!applicationId) return;
    let active = true;
    setLoading(true);
    szhpService
      .getHousingApplicationById(applicationId)
      .then((d) => {
        if (!active) return;
        useFormMethods.reset({
          ...DEFAULTS,
          maritalStatus: d.maritalStatus ?? '',
          maritalCategory: d.maritalCategory ?? '',
          noOfWives: d.noOfWives ?? '',
          noOfChildrens: d.noOfChildrens ?? '',
          divorceDate: d.divorceDate ?? null,
          spouseDeathDate: d.spouseDeathDate ?? null,
          employerName: d.employerDetails?.employerName ?? '',
          desigination: d.employerDetails?.desigination ?? '',
          sector: d.employerDetails?.sector ?? '',
          workCategory: d.employerDetails?.workCategory ?? '',
          annualIncome: d.employerDetails?.annualIncome ?? '',
          startDate: d.employerDetails?.startDate ?? null,
          housingOwnership: d.housingOwnership ?? '',
          region: d.region ?? '',
          familyBookEmirate: d.familyBookEmirate ?? '',
          location: d.location ?? '',
          leaseRentalDate: d.leaseRentalDate ?? null,
          landForConstruction: d.landForConstruction ?? '',
          assistanceType: d.assistanceType ?? '',
          assistancePurpose: d.assistancePurpose ?? '',
          purposeCategory: d.purposeCategory ?? '',
          noOfBedRooms: d.noOfBedRooms ?? '',
          technicalConsition: d.technicalConsition ?? '',
          dwellingYOC: d.dwellingYOC ?? '',
          constructionAreSqFeet: d.constructionAreSqFeet ?? '',
          yearsOfStaying: d.yearsOfStaying ?? '',
          noOfOccupants: d.noOfOccupants ?? '',
          noOfRooms: d.noOfRooms ?? '',
          noOfCouncils: d.noOfCouncils ?? '',
          noOfBathrooms: d.noOfBathrooms ?? '',
          noOfKitchens: d.noOfKitchens ?? '',
          receviedHousingAID: d.receviedHousingAID === 'Y',
          noPrevHousingAsst: typeof d.noPrevHousingAsst === 'string' ? d.noPrevHousingAsst : '',
        });
      })
      .catch(() => {
        if (active) setError('The request could not be loaded.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [applicationId, useFormMethods]);

  const save = async (submit: boolean) => {
    setSaving(true);
    setError(null);
    try {
      const payload = toPayload(useFormMethods.getValues());
      const saved = editing
        ? await szhpService.updateHousingApplication(applicationId!, payload)
        : await szhpService.createHousingApplication(payload);

      const id = saved.applicationId ?? applicationId;
      if (submit && id) {
        await szhpService.submitHousingApplication(id);
      }
      navigate(`/housing-requests/${id}`);
    } catch {
      setError('The request could not be saved.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  const socialStatusFields: FieldData[] = [
    { name: 'maritalStatus', label: 'Marital Status', type: 'select', isMandatory: true, options: MARITAL_STATUS_OPTIONS },
    { name: 'maritalCategory', label: 'Marital Category', type: 'select', options: MARITAL_CATEGORY_OPTIONS },
    { name: 'noOfWives', label: 'Number of Wives', type: 'number' },
    { name: 'noOfChildrens', label: 'Number of Children', type: 'number' },
    { name: 'divorceDate', label: 'Divorce Date', type: 'date' },
    { name: 'spouseDeathDate', label: 'Spouse Death Date', type: 'date' },
    { name: 'employerName', label: 'Employer Name', type: 'text' },
    { name: 'desigination', label: 'Designation', type: 'text' },
    { name: 'sector', label: 'Sector', type: 'text' },
    { name: 'workCategory', label: 'Work Category', type: 'text' },
    { name: 'annualIncome', label: 'Monthly Income', type: 'number' },
    { name: 'startDate', label: 'Employment Start Date', type: 'date' },
  ];

  const housingDataFields: FieldData[] = [
    { name: 'housingOwnership', label: 'Housing Ownership', type: 'select', isMandatory: true, options: HOUSING_OWNERSHIP_OPTIONS },
    { name: 'region', label: 'Region', type: 'select', isMandatory: true, options: EMIRATE_OPTIONS },
    { name: 'familyBookEmirate', label: 'Emirates Based on Family Book', type: 'select', isMandatory: true, options: EMIRATE_OPTIONS },
    { name: 'location', label: 'Property Location', type: 'text' },
    { name: 'leaseRentalDate', label: 'Lease / Rental Date', type: 'date' },
  ];

  const assistanceFields: FieldData[] = [
    { name: 'landForConstruction', label: 'Do you have ready land for construction?', type: 'select', options: YES_NO },
    { name: 'assistanceType', label: 'Type of Assistance', type: 'select', isMandatory: true, options: ASSISTANCE_TYPE_OPTIONS },
    { name: 'assistancePurpose', label: 'Purpose of Assistance', type: 'select', isMandatory: true, options: ASSISTANCE_PURPOSE_OPTIONS },
    { name: 'noOfBedRooms', label: 'Number of Bedrooms Required?', type: 'number' },
  ];

  const residentialFields: FieldData[] = [
    { name: 'technicalConsition', label: 'Technical Conditions', type: 'select', options: TECHNICAL_CONDITION_OPTIONS },
    { name: 'dwellingYOC', label: 'Year of Construction of the Dwelling', type: 'number' },
    { name: 'constructionAreSqFeet', label: 'Construction Area in Square Feet', type: 'number' },
    { name: 'yearsOfStaying', label: 'Years of Staying', type: 'number' },
    { name: 'noOfOccupants', label: 'Number of People Living', type: 'number' },
    { name: 'noOfRooms', label: 'Number of Rooms', type: 'number' },
    { name: 'noOfCouncils', label: 'Number of Councils', type: 'number' },
    { name: 'noOfBathrooms', label: 'Number of Bathrooms', type: 'number' },
    { name: 'noOfKitchens', label: 'Number of Kitchens', type: 'number' },
    {
      name: 'receviedHousingAID',
      label: 'Have you ever received housing assistance from any government agency?',
      type: 'checkbox',
      cols: 2,
    },
  ];

  if (loading) {
    return <Loader label='Loading the request' />;
  }

  return (
    <div className={hp('outlet-root')}>
      <Breadcrumbs
        itemFeed={[
          { label: 'My Requests', path: '/housing-requests' },
          { label: editing ? 'Edit Request' : 'New Request', path: '' },
        ]}
      />

      <h1 className={hp('text-2xl font-bold text-[#323438] mt-4 mb-6')}>
        Housing Assistance Request
      </h1>

      {error ? <Alert type='error' showIcon message={error} className={hp('mb-4')} /> : null}

      <form onSubmit={useFormMethods.handleSubmit(() => save(true))}>
        <SectionHeader title='Social Status' />
        <div className={hp('grid grid-cols-1 md:grid-cols-3 gap-4 mb-8')}>
          <FormFieldGenerator data={socialStatusFields} useFormMethods={useFormMethods} />
        </div>

        <SectionHeader title='Housing Data' />
        <div className={hp('grid grid-cols-1 md:grid-cols-3 gap-4 mb-8')}>
          <FormFieldGenerator data={housingDataFields} useFormMethods={useFormMethods} />
        </div>

        <SectionHeader title='Assistance Request Details' />
        <div className={hp('grid grid-cols-1 md:grid-cols-3 gap-4 mb-8')}>
          <FormFieldGenerator data={assistanceFields} useFormMethods={useFormMethods} />
        </div>

        <SectionHeader title='Residential Details' />
        <div className={hp('grid grid-cols-1 md:grid-cols-3 gap-4 mb-8')}>
          <FormFieldGenerator data={residentialFields} useFormMethods={useFormMethods} />
        </div>

        <div className={hp('flex flex-wrap gap-3')}>
          <Button type='submit' disabled={saving}>
            {saving ? 'Working...' : 'Submit Request'}
          </Button>
          <Button type='button' styleVariant='outline' disabled={saving} onClick={() => void save(false)}>
            Save as Draft
          </Button>
          <Button type='button' styleVariant='link' onClick={() => navigate('/housing-requests')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default HousingAssistanceForm;
