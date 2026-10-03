import { Link } from 'react-router-dom'
import { ArrowRight, Timer, PenLine, Megaphone, CheckCircle2, XCircle } from 'lucide-react'
import { useProgress } from '../../hooks/useProgress'
import { Page, PageHeader, Button, SectionLabel } from '../../components/ui'

// Deliberately says nothing about the trick: the test only works if it’s a surprise.
export default function CommIntro() {
  const { progress } = useProgress()
  return (
    <Page>
      <PageHeader back="/activities" eyebrow="Activity · Effective Communication" title="2½ Minutes Test" subtitle="Are you a good receiver? You will receive a test paper. Follow its instructions within the time limit." />

      <div className="card p-5 space-y-4">
        <Row icon={Timer} title="2 minutes 30 seconds" text="The clock starts when you turn the paper over." />
        <Row icon={PenLine} title="Pen, Write and Read tools" text="Draw or write on the paper just like a real worksheet. Tap an instruction’s number to tick it off." />
        <Row icon={Megaphone} title="Some instructions ask you to speak or move" text="If you’re doing this in class, do them for real, then tick them off on the paper." />
      </div>

      <Button to="/activities/comm-test/run" variant="gold" className="w-full mt-6 text-lg py-4">I’m ready <ArrowRight size={18} /></Button>

      {progress.commtest.length > 0 && (
        <>
          <SectionLabel className="mt-10">Past attempts</SectionLabel>
          <div className="card divide-y divide-line overflow-hidden">
            {progress.commtest.map((r, i) => (
              <Link key={r.date} to={`/activities/comm-test/result?i=${i}`} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-2">
                {r.passed ? <CheckCircle2 className="text-good" size={22} /> : <XCircle className="text-bad" size={22} />}
                <span className="flex-1">
                  <span className="block font-semibold">{r.passed ? 'Good receiver' : 'Caught out'}</span>
                  <span className="block text-xs text-muted">{new Date(r.date).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} · {r.elapsed}s</span>
                </span>
                <ArrowRight size={16} className="text-faint" />
              </Link>
            ))}
          </div>
        </>
      )}
    </Page>
  )
}

function Row({ icon: Icon, title, text }) {
  return (
    <div className="flex gap-3">
      <span className="grid place-items-center h-9 w-9 shrink-0 rounded-lg bg-gold-soft text-ink"><Icon size={18} /></span>
      <div><p className="font-semibold text-[15px]">{title}</p><p className="text-sm text-muted">{text}</p></div>
    </div>
  )
}
